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
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    completed_onboarding: Optional[bool] = None


class Business(BaseModel):
    id: str
    borrower_id: str
    buyer_first_name: Optional[str] = None
    buyer_last_name: Optional[str] = None
    buyer_email: Optional[str] = None
    buyer_linkedin: Optional[str] = None
    owner_first_name: Optional[str] = None
    owner_last_name: Optional[str] = None
    owner_email: Optional[str] = None
    company_name: str
    company_website: str
    company_state: str
    naics_code: int


class Lender(BaseModel):
    id: str
    website: Optional[str]
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    type: str
    name: str
    avg_interest_rate_in_sector: Optional[float] = None
    num_loans_in_sector: Optional[int] = None
    avg_interest_rate: Optional[float] = None
    num_loans: Optional[int] = None


class LoanApplication(BaseModel):
    lender_id: str
    business_id: str
    borrower_id: str
    status: str
    lender_name: str
