from typing import List, Optional, Any
from models.models import (
    Business,
)
from pydantic import BaseModel


class CompleteOnboardingRequest(BaseModel):
    first_name: str
    last_name: str
    loan_amount: float
    company_name: str
    company_website: str
    company_state: str


class CompleteOnboardingResponse(BaseModel):
    success: bool
