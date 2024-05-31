import os
from pydantic import BaseModel
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, Tuple
from enum import Enum
import datetime
import io


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
    loan_amount: float
    buyer_linkedin: Optional[str] = None
    company_name: str
    company_website: str
    company_state: str
    naics_code: Optional[int] = None
    under_loi: Optional[bool] = None
    has_vectordb: Optional[bool] = None


class BusinessFile(BaseModel):
    content: io.BytesIO
    filename: str
    content_type: str

    class Config:
        arbitrary_types_allowed = True


class BusinessFiles(BaseModel):
    buyer_resume: Optional[BusinessFile] = None
    buyer_credit_score: Optional[BusinessFile] = None
    buyer_2021_tax_return: Optional[BusinessFile] = None
    buyer_2022_tax_return: Optional[BusinessFile] = None
    buyer_2023_tax_return: Optional[BusinessFile] = None
    buyer_form_413: Optional[BusinessFile] = None
    cim: Optional[BusinessFile] = None
    business_2021_tax_return: Optional[BusinessFile] = None
    business_2022_tax_return: Optional[BusinessFile] = None
    business_2023_tax_return: Optional[BusinessFile] = None
    business_2024_pnl: Optional[BusinessFile] = None
    business_2024_balance_sheet: Optional[BusinessFile] = None
    loi: Optional[BusinessFile] = None


class Lender(BaseModel):
    id: str
    website: Optional[str]
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    type: str
    name: str
    avg_interest_rate: Optional[float] = None
    avg_fixed_rate: Optional[float] = None
    avg_variable_rate: Optional[float] = None
    num_loans: Optional[int] = None
    state_locations: Optional[str] = None
    logo_url: Optional[str] = None
    has_referral_fee: Optional[bool] = True


class LoanStatus(str, Enum):
    applied = "applied"
    term_sheet = "term_sheet"
    rejected = "rejected"
    not_yet_applied = "not_yet_applied"


class LoanApplication(BaseModel):
    lender_id: str
    business_id: str
    borrower_id: str
    status: LoanStatus
    lender_name: str
    lender: Optional[Lender] = None


class ProcessingState(str, Enum):
    not_started = "NOT_STARTED"
    queued = "QUEUED"
    processing = "PROCESSING"
    processed = "PROCESSED"
    failed = "FAILED"


class VellumDocument(BaseModel):
    filename: str
    filepath: str
    processing_state: ProcessingState
    signed_url: Optional[str] = None
