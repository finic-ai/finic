from typing import List, Optional, Any
from models.models import Business, VellumDocument, Message
from pydantic import BaseModel
from enum import Enum


class CompleteOnboardingRequest(BaseModel):
    first_name: str
    last_name: str


class CreateBusinessRequest(BaseModel):
    loan_amount: float
    phone_number: str
    company_name: str
    company_website: str
    company_state: str


class CompleteOnboardingResponse(BaseModel):
    success: bool


class ApplyForLoanRequest(BaseModel):
    lender_id: str


class GetDiligenceDocsResponse(BaseModel):
    doc: Optional[VellumDocument] = None
    business_id: str


class GetDiligenceDocsRequest(BaseModel):
    vectorize: bool


class ChatRequest(BaseModel):
    messages: List[Message]
