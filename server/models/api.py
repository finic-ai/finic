from typing import List, Optional, Any
from models.models import (
    Business,
)
from pydantic import BaseModel


class CompleteOnboardingRequest(BaseModel):
    first_name: str
    last_name: str
    applicant_type: str
    loan_amount: float
    company_name: str
    company_website: str
    buyer_first_name: str
    buyer_last_name: str
    buyer_email: str
    buyer_linkedin: str
    owner_first_name: str
    owner_last_name: str
    owner_email: str


class CompleteOnboardingResponse(BaseModel):
    success: bool
