import os
from pydantic import BaseModel, ConfigDict
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, Tuple
from enum import Enum
from strenum import StrEnum
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


class NodeType(str, Enum):
    source = "source"
    destination = "destination"
    transform = "transform"


class SourceType(str, Enum):
    google_cloud_storage = "google_cloud_storage"


class DestinationType(str, Enum):
    snowflake = "snowflake"


class TransformationType(str, Enum):
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


class GCSConfiguration(BaseModel):
    bucket: str
    filename: str


class SourceNode(Node):
    source: SourceType
    credentials: Dict[str, Any]
    configuration: GCSConfiguration


class SnowflakeConfiguration(BaseModel):
    account: str
    warehouse: str
    database: str
    table_schema: str
    table: str


class DestinationNode(Node):
    destination: DestinationType
    credentials: Dict[str, Any]
    configuration: SnowflakeConfiguration


class TransformNode(Node):
    transformation: TransformationType


class ColumnMapping(BaseModel):
    old_name: str
    new_name: str


class MappingNode(TransformNode):
    mappings: List[ColumnMapping]


class PythonNode(TransformNode):
    pass


class JoinNode(TransformNode):
    join_column: str

class WorkflowStatus(Enum):
    DRAFT = "draft"
    DEPLOYED = "deployed"
    SUCCESSFUL = "successful"
    FAILED = "failed"

class Workflow(BaseModel):
    id: str
    app_id: str
    nodes: List[Node]
    edges: List[Edge]
