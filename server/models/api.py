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


class CompleteOnboardingRequest(BaseModel):
    first_name: str
    last_name: str


class UpsertWorkflowRequest(BaseModel):
    workflow: Workflow


class GetWorkflowRequest(BaseModel):
    id: str


class ListWorkflowsRequest(BaseModel):
    pass
