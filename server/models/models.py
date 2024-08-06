import os
from pydantic import BaseModel
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, Tuple
from enum import Enum
import datetime
import io


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


class NodeType(Enum):
    source = "source"
    destination = "destination"
    transform = "transform"


class SourceType(Enum):
    google_cloud_storage = "google_cloud_storage"


class DestinationType(Enum):
    snowflake = "snowflake"


class TransformationType(Enum):
    python = "python"
    sql = "sql"
    mapping = "mapping"
    join = "join"
    split = "split"
    filter = "filter"
    conditional = "conditional"


class Node(BaseModel):
    id: str
    position: NodePosition
    type: NodeType


class SourceNode(Node):
    source: SourceType
    credentials: Dict[str, Any]
    configuration: Dict[str, Any]


class DestinationNode(Node):
    destination: DestinationType
    credentials: Dict[str, Any]
    configuration: Dict[str, Any]


class TransformNode(Node):
    transformation: TransformationType
    configuration: Optional[Dict[str, Any]] = None


class ColumnMapping(BaseModel):
    old_name: str
    new_name: str


class MappingNode(TransformNode):
    mappings: List[ColumnMapping]


class PythonNode(TransformNode):
    pass


class JoinNode(TransformNode):
    join_column: str


class GCSNode(SourceNode):
    bucket: str
    filename: str
    project_id: str


class SnowflakeNode(DestinationNode):
    account: str
    warehouse: str
    database: str
    schema: str
    table: str


class Workflow(BaseModel):
    id: str
    app_id: str
    nodes: List[Node]
    edges: List[Edge]
