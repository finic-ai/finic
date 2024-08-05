from pydantic import BaseModel
from enum import Enum
import datetime
from typing import List, Optional, Dict, Any
from models.models import Node, Edge


class CompleteOnboardingRequest(BaseModel):
    first_name: str
    last_name: str


class UpsertWorkflowRequest(BaseModel):
    id: str
    nodes: List[Node]
    edges: List[Edge]


class RunWorkflowRequest(BaseModel):
    workflow_id: str


class GetAvailableSourceDatasetsRequest(BaseModel):
    node_id: str


class GetAvailableDestinationTablesRequest(BaseModel):
    node_id: str
