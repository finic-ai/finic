from pydantic import BaseModel
from enum import Enum
import datetime
from typing import List, Optional, Dict, Any
from models.models import (
    AppConfig,
    User,
    Workflow,
    Edge,
    Node,
    NodeType,
    SourceNode,
    DestinationNode,
    TransformNode,
    TransformationType,
    MappingNode,
    PythonNode,
    JoinNode,
)


class CompleteOnboardingRequest(BaseModel):
    first_name: str
    last_name: str


class UpsertWorkflowRequest(BaseModel):
    id: str
    nodes: List[Node]
    edges: List[Edge]


class GetWorkflowRequest(BaseModel):
    id: str

class ListWorkflowsRequest(BaseModel):
    pass
