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

class Session(BaseModel):
    id: str
    app_id: str
    browser_id: Optional[str] = None

class FinicEnvironment(str, Enum):
    LOCAL = "local"
    DEV = "dev"
    PROD = "prod"
