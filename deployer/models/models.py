from enum import Enum
import datetime
from typing import Optional
from pydantic import BaseModel


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
