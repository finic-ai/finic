from pydantic import BaseModel
from enum import Enum
import datetime
import uuid
from typing import List, Optional, Dict, Any, Union
from .models import AppConfig, User, Agent, ExecutionAttempt
from bs4 import Tag
from playwright.sync_api import Page


class GetAgentRequest(BaseModel):
    agent_id: str


class GetExecutionRequest(BaseModel):
    agent_id: str
    execution_id: str


class DeployAgentRequest(BaseModel):
    agent_id: str
    agent_description: str
    num_retries: int


class DeleteAgentRequest(BaseModel):
    agent_id: str
    num_retries: int


class RunAgentRequest(BaseModel):
    agent_id: str
    input: Dict[str, Any] = {}


class LogExecutionAttemptRequest(BaseModel):
    execution_id: str
    agent_id: str
    results: Dict[str, Any]
    attempt: ExecutionAttempt

class GetSelectorsRequest(BaseModel):
    url: str
    agent_id: str

# class GenerateSelectorsRequest(BaseModel):
#     page: str
#     agent_id: str
#     selector_ids: Optional[List[str]] = None

class GenerateSelectorsRequest(BaseModel):
    selectors: List[str]
    url: str
    html: str

class RegenerateSelectorsRequest(BaseModel):
    selectors_ids: List[str]
    url: str
    html: str
