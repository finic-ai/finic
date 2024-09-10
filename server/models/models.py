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
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    completed_onboarding: Optional[bool] = None


class JobStatus(str, Enum):
    deploying = "deploying"
    deployed = "deployed"
    failed = "deploy_failed"


class ExecutionStatus(str, Enum):
    running = "running"
    successful = "successful"
    failed = "failed"


class Job(BaseModel):
    id: str
    app_id: str
    name: str
    status: JobStatus

    @staticmethod
    def get_full_id(job: "Job") -> str:
        return f"{job.app_id}-{job.id}"


class Execution(BaseModel):
    job_id: str
    app_id: str
    status: ExecutionStatus
    start_time: Optional[datetime.datetime] = None
    end_time: Optional[datetime.datetime] = None
    results: Dict[str, Any] = {}
