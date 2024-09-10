from pydantic import BaseModel
from enum import Enum
import datetime
import uuid
from typing import List, Optional, Dict, Any
from .models import AppConfig, User, Job


class GetJobRequest(BaseModel):
    job_id: str


class GetExecutionRequest(BaseModel):
    job_id: str
    execution_id: str


class DeployJobRequest(BaseModel):
    job_id: str
    job_name: str
