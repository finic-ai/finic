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
    x: int
    y: int


class NodeType(str, Enum):
    source = "source"
    destination = "destination"
    transform = "transform"


class SourceNodeData(BaseModel):
    node_type: Literal[NodeType.source] = NodeType.source
    configuration: GCSSourceConfig


class DestinationNodeData(BaseModel):
    node_type: Literal[NodeType.destination] = NodeType.destination
    configuration: SnowflakeDestinationConfig


class TransformNodeData(BaseModel):
    node_type: Literal[NodeType.transform] = NodeType.transform
    configuration: Union[
        MappingTransformConfig, PythonTransformConfig, JoinTransformConfig
    ] = Field(..., discriminator="transform_type")


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
    position: NodePosition
    node_data: Union[SourceNodeData, DestinationNodeData, TransformNodeData] = Field(
        ..., discriminator="node_type"
    )


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
