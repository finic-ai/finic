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
    status: Optional[str] = None
    business_name: Optional[str] = None
    buyer_name: Optional[str] = None
    legal_entity: Optional[str] = None
    business_revenue: Optional[float] = None
    business_ebitda: Optional[float] = None
    purchase_price: Optional[float] = None
    note_percent: Optional[float] = None
    note_interest_rate: Optional[float] = None
    note_term: Optional[int] = None
    note_standby: Optional[int] = None
    transaction_type: Optional[str] = None
    earnout_description: Optional[str] = None
    escrow_percent: Optional[float] = None
    closing_date: Optional[datetime.date] = None
    exclusivity_days: Optional[int] = None
    termination_fee_type: Optional[str] = None
    termination_fee_amount: Optional[float] = None
    governing_law: Optional[str] = None
    expiration_date: Optional[datetime.date] = None
    business_address: Optional[str] = None
    business_state: Optional[str] = None
    business_entity_type: Optional[str] = None
    seller_name: Optional[str] = None
    equity_rollover_percent: Optional[float] = None
    escrow_cap: Optional[int] = None
    escrow_tipping_basket: Optional[int] = None
    note_payment_type: Optional[str] = None

class ComposeLoiRequest(BaseModel):
    loi_id: str


class CompleteOnboardingResponse(BaseModel):
    success: bool


class ApplyForLoanRequest(BaseModel):
    lender_id: str


class GetDiligenceDocsResponse(BaseModel):
    doc: Optional[VellumDocument] = None
    business_id: str


class GetDiligenceDocsRequest(BaseModel):
    vectorize: bool


class GetLoiRequest(BaseModel):
    loi_id: Optional[str] = None


class ChatRequest(BaseModel):
    messages: List[Message]


class GetUsernameRequest(BaseModel):
    id: str


class GetQuickbooksStatusRequest(BaseModel):
    id: str
