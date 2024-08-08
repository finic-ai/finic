from pydantic import BaseModel
from enum import Enum
import datetime
import uuid
from typing import List, Optional, Dict, Any
from models.models import (
    AppConfig,
    User,
    Workflow,
    WorkflowStatus,
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
    id: Optional[str] = uuid.uuid4()
    status: Optional[WorkflowStatus] = "draft"
    nodes: Optional[List[Node]] = []
    edges: Optional[List[Edge]] = []


class GetWorkflowRequest(BaseModel):
    id: str

class ListWorkflowsRequest(BaseModel):
    pass
