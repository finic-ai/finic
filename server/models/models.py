import os
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, Tuple, Type, Union
from enum import Enum
import datetime


class SessionStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"   
    RUNNING = "running"

class AppConfig(BaseModel):
    user_id: str
    app_id: str


class User(BaseModel):
    id: str
    created_at: datetime.datetime
    email: str
    secret_key: str
    avatar_url: str

class Session(BaseModel):
    id: str
    app_id: str
    agent_id: str
    status: SessionStatus
    browser_id: Optional[str] = None
    results: Optional[List[Dict]] = None
    error: Optional[Dict] = None
    created_at: datetime.datetime

    # created at should serialize to isoformat when converting to json  

    # model_config = ConfigDict(json_encoders={datetime.datetime: lambda v: v.isoformat()})

class Browser(BaseModel):
    id: str
    app_id: str
    state: Optional[Dict] = None

class FinicEnvironment(str, Enum):
    LOCAL = "local"
    DEV = "development"
    PROD = "production"

class Agent(BaseModel):
    id: str
    app_id: str
    name: str
    num_retries: int

class DOMNodeDetails(BaseModel):
    selector: Optional[str] = None
    nodeId: int
    backendNodeId: int
    nodeType: int
    nodeName: str
    nodeValue: str
    childNodeCount: Optional[int] = 0
    attributes: List[Dict[str, str]] = []
    textContent: Optional[str] = None
    outerHTML: Optional[str] = None