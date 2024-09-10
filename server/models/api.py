from pydantic import BaseModel
from enum import Enum
import datetime
import uuid
from typing import List, Optional, Dict, Any
from .models import AppConfig, User, Job


class GetJobRequest(BaseModel):
    id: str


class GetExecutionRequest(BaseModel):
    job_id: str
    run_id: str


class DeployJobRequest(BaseModel):
    job_id: str
    job_name: str
