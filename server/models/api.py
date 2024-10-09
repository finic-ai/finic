from pydantic import BaseModel
from enum import Enum
import datetime
import uuid
from typing import List, Optional, Dict, Any
from .models import AppConfig, User

class RunAgentRequest(BaseModel):
    browser_id: Optional[str] = None
    agent_input: Optional[Dict[str, Any]] = None

class AgentUploadRequest(BaseModel):
    agent_name: str
    num_retries: int
