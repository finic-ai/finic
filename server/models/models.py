import os
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, Tuple, Type, Union
from enum import Enum
from strenum import StrEnum
import datetime
import io
import uuid
from models.node_configurations import (
    GCSSourceConfig,
    SnowflakeDestinationConfig,
    MappingTransformConfig,
    PythonTransformConfig,
    JoinTransformConfig,
)
from typing_extensions import Literal


class AppConfig(BaseModel):
    user_id: str
    app_id: str


class User(BaseModel):
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    completed_onboarding: Optional[bool] = None


class Edge(BaseModel):
    id: str
    source: str
    target: str


class NodePosition(BaseModel):
    x: float
    y: float


class NodeType(str, Enum):
    SOURCE = "source"
    DESTINATION = "destination"
    TRANSFORMATION = "transformation"


class SourceNodeData(BaseModel):
    name: str
    configuration: Optional[GCSSourceConfig] = None


class DestinationNodeData(BaseModel):
    name: str
    configuration: Optional[SnowflakeDestinationConfig] = None


class TransformNodeData(BaseModel):
    name: str
    configuration: Optional[PythonTransformConfig] = None


class WorkflowStatus(str, Enum):
    draft = "draft"
    deployed = "deployed"
    successful = "successful"
    failed = "failed"


class WorkflowRunStatus(str, Enum):
    running = "running"
    successful = "successful"
    failed = "failed"


class Node(BaseModel):
    id: str
    type: NodeType
    position: NodePosition
    data: Union[SourceNodeData, DestinationNodeData, TransformNodeData]

    def __init__(self, **data):
        node_type = data.get("type")
        if node_type == NodeType.SOURCE:
            data["data"] = SourceNodeData(**data["data"])
        elif node_type == NodeType.DESTINATION:
            data["data"] = DestinationNodeData(**data["data"])
        elif node_type == NodeType.TRANSFORMATION:
            data["data"] = TransformNodeData(**data["data"])
        
        super().__init__(**data)


class Workflow(BaseModel):
    id: str
    app_id: str
    name: str
    status: WorkflowStatus
    nodes: List[Node] = []
    edges: List[Edge] = []


class WorkflowRun(BaseModel):
    workflow_id: str
    status: WorkflowRunStatus
    start_time: Optional[datetime.datetime] = None
    end_time: Optional[datetime.datetime] = None
    results: Dict[str, Any] = {}
