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
    WorkflowStatus,
)


class UpsertWorkflowRequest(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    status: Optional[WorkflowStatus] = None
    nodes: Optional[List[Node]] = None
    edges: Optional[List[Edge]] = None

class SetWorkflowStatusRequest(BaseModel):
    status: WorkflowStatus


class GetWorkflowRequest(BaseModel):
    id: str


class ListWorkflowsRequest(BaseModel):
    pass
