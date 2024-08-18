from pydantic import BaseModel
from enum import Enum
import datetime
import uuid
from typing import List, Optional, Dict, Any
from .models import (
    AppConfig,
    User,
    Workflow,
    WorkflowStatus,
    Edge,
    Node,
    NodeType,
    NodePosition,
    WorkflowStatus,
)


class UpsertWorkflowRequest(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    status: Optional[WorkflowStatus] = None
    nodes: Optional[List[Dict]] = None
    edges: Optional[List[Dict]] = None

class GetTransformationRequest(BaseModel):
    workflow_id: str
    node_id: str

class UpsertTransformationRequest(BaseModel):
    workflow_id: str
    node_id: str
    code: str

class UpdateNodeConfigurationRequest(BaseModel):
    workflow_id: str
    node_id: str
    configuration: Dict[str, Any]

class CheckCredentialsRequest(BaseModel):
    workflow_id: str
    node_id: str

class GetWorkflowRequest(BaseModel):
    id: str


class DeleteWorkflowRequest(BaseModel):
    id: str


class ListWorkflowsRequest(BaseModel):
    pass
