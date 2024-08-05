from pydantic import BaseModel
from enum import Enum
import datetime
from typing import List, Optional, Dict, Any


class CompleteOnboardingRequest(BaseModel):
    first_name: str
    last_name: str


class UpsertWorkflowRequest(BaseModel):
    id: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
