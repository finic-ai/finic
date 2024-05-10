import os
from pydantic import BaseModel
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, Tuple
from enum import Enum
import datetime


class AppConfig(BaseModel):
    user_id: str


class User(BaseModel):
    id: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    completed_onboarding: Optional[bool]
    type: Optional[str]


class Business(BaseModel):
    id: str
    borrower_id: str
    buyer_first_name: str
    buyer_last_name: str
    buyer_email: str
    buyer_linkedin: str
    owner_first_name: str
    owner_last_name: str
    owner_email: str
    company_name: str
    company_website: str


class LoanApplication(BaseModel):
    lender_id: str
    business_id: str
    borrower_id: str
    status: str
    lender_name: str
