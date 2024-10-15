from pydantic import BaseModel
from enum import Enum
import datetime
import uuid
from typing import List, Optional, Dict, Any
from .models import AppConfig, User, SessionStatus

class RunAgentRequest(BaseModel):
    browser_id: Optional[str] = None
    agent_input: Dict[str, Any]

class AgentUploadRequest(BaseModel):
    agent_name: str
    num_retries: int

class UpdateSessionRequest(BaseModel):
    status: Optional[SessionStatus] = None
    results: Optional[List[Dict]] = None
    error: Optional[Dict] = None

class CopilotRequest(BaseModel):
    intent: str
    element: Dict[str, Any]
    existing_code: str
