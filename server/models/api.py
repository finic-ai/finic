from typing import List, Optional, Any
from models.models import Business, VellumDocument, Message
from pydantic import BaseModel
from enum import Enum
import datetime


class CompleteOnboardingRequest(BaseModel):
    first_name: str
    last_name: str


class CreateBusinessRequest(BaseModel):
    loan_amount: float
    phone_number: str
    company_name: str
    company_website: str
    company_state: str

class CreateLoiRequest(BaseModel):
    id: Optional[str] = None
    business_name: Optional[str] = None
    buyer_name: Optional[str] = None
    legal_entity: Optional[str] = None
    biz_revenue: Optional[float] = None
    biz_ebitda: Optional[float] = None
    financials_period: Optional[str] = None
    purchase_price: Optional[float] = None
    note_percent: Optional[float] = None
    note_interest_rate: Optional[float] = None
    note_term: Optional[int] = None
    note_standby: Optional[int] = None
    transaction_type: Optional[str] = None
    earnout_description: Optional[str] = None
    escrow_percent: Optional[float] = None
    closing_date: Optional[datetime.date] = None
    exclusivity_start_date: Optional[datetime.date] = None
    exclusivity_end_date: Optional[datetime.date] = None
    termination_fee_type: Optional[str] = None
    termination_fee_amount: Optional[float] = None
    governing_law: Optional[str] = None
    expiration_date: Optional[datetime.date] = None

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
