import os
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, Tuple, Type, Union
from enum import Enum
import datetime


class AppConfig(BaseModel):
    user_id: str
    app_id: str


class User(BaseModel):
    id: str
    created_at: datetime.datetime
    email: str
    secret_key: str
    avatar_url: str


class AgentStatus(str, Enum):
    deploying = "deploying"
    deployed = "deployed"
    failed = "deploy_failed"


class ExecutionStatus(str, Enum):
    running = "running"
    successful = "successful"
    failed = "failed"


class Agent(BaseModel):
    finic_id: str
    id: str
    app_id: str
    description: str
    status: AgentStatus
    created_at: Optional[datetime.datetime] = None
    num_retries: int = 3

    @staticmethod
    def get_cloud_job_id(agent: "Agent") -> str:
        return f"job-{agent.finic_id}"


class Execution(BaseModel):
    id: str
    finic_agent_id: str
    user_defined_agent_id: str
    app_id: str
    cloud_provider_id: str
    status: ExecutionStatus
    start_time: Optional[datetime.datetime] = None
    end_time: Optional[datetime.datetime] = None
    results: Dict[str, Any] = {}
    attempts: List["ExecutionAttempt"] = []


class ExecutionAttempt(BaseModel):
    success: bool
    logs: List[str]


class FinicEnvironment(str, Enum):
    LOCAL = "local"
    DEV = "dev"
    PROD = "prod"
