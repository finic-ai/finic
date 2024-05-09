import os
from pydantic import BaseModel
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, Tuple
from enum import Enum
import datetime


class AppConfig(BaseModel):
    app_id: str
    user_id: str


class UserSource(str, Enum):
    google = "google"
    linkedin = "linkedin"
    twitter = "twitter"
    word_of_mouth = "word_of_mouth"
    outbound_campaign = "outbound_campaign"
    newsletter = "newsletter"
    other = "other"

    def from_string(string: str) -> "UserSource":
        lower_string = string.lower()
        if lower_string == "google":
            return UserSource.google
        elif lower_string == "linkedin":
            return UserSource.linkedin
        elif lower_string == "twitter":
            return UserSource.twitter
        elif lower_string == "word_of_mouth" or lower_string == "word of mouth":
            return UserSource.word_of_mouth
        elif (
            lower_string == "outbound_campaign"
            or lower_string == "dealwise team reached out to me"
        ):
            return UserSource.outbound_campaign
        elif lower_string == "newsletter" or lower_string == "newsletter appearance":
            return UserSource.newsletter
        else:
            return UserSource.other


class SellerIntent(str, Enum):
    actively_selling = "actively_selling"
    open_to_offers = "open_to_offers"

    def from_string(string: str) -> "SellerIntent":
        lower_string = string.lower()
        if (
            lower_string == "actively_selling"
            or lower_string == "selling within 6 months"
        ):
            return SellerIntent.actively_selling
        elif (
            lower_string == "open_to_offers"
            or lower_string == "not actively selling, open to offers"
        ):
            return SellerIntent.open_to_offers
        else:
            return SellerIntent.open_to_offers


class PreferredBuyerType(str, Enum):
    strategics_only = "strategics_only"
    financial_only = "financial_only"
    open_to_all = "open_to_all"

    def from_string(string: str) -> "PreferredBuyerType":
        lower_string = string.lower()
        if lower_string == "strategics_only" or lower_string == "strategic buyers only":
            return PreferredBuyerType.strategics_only
        elif (
            lower_string == "financial_only" or lower_string == "financial buyers only"
        ):
            return PreferredBuyerType.financial_only
        else:
            return PreferredBuyerType.open_to_all


class ApprovalStatus(str, Enum):
    approved = "approved"
    not_submitted = "not_submitted"
    under_review = "under_review"


class BuyerType(str, Enum):
    search_fund = "search_fund"
    self_funded = "self_funded"
    private_equity = "private_equity"
    holding_company = "holding_company"
    strategic = "strategic"
    other = "other"

    def from_label(label: str) -> "BuyerType":
        if label == "Self-funded":
            return BuyerType.self_funded
        elif label == "Search Fund":
            return BuyerType.search_fund
        elif label == "Private Equity Firm":
            return BuyerType.private_equity
        elif label == "Holding Company":
            return BuyerType.holding_company
        elif label == "Strategic Acquirer":
            return BuyerType.strategic
        else:
            return BuyerType.other


class User(BaseModel):
    app_id: str
    id: str
    is_seller: bool
    completed_onboarding: bool
    full_name: Optional[str] = ""
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    email: str
    calendar_link: Optional[str] = None


class BuyerInfo(BaseModel):
    user_id: str
    listings_messaged: Optional[List[str]] = []
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    linkedin_profile: Optional[str] = None
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    whitelisted: Optional[bool] = False
    approval_status: Optional[ApprovalStatus] = ApprovalStatus.not_submitted
    buyer_type: Optional[BuyerType] = None


class SellerInfo(BaseModel):
    user_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    listings: List[str] = []


class Message(BaseModel):
    message: str
    sender_app_id: str
    sender_user_id: Optional[str] = None
    pending: Optional[bool] = True
    accepted: Optional[bool] = False
    sent_at: Optional[int] = None
    responded_at: Optional[int] = None


class MessageRequest(BaseModel):
    listing_id: str
    listing_name: str
    message: Message
    message_sender_full_name: str
    message_sender_linkedin_profile: Optional[str] = None
    message_sender_company_name: Optional[str] = None
    message_sender_company_website: Optional[str] = None


class ListingActivityStatus(str, Enum):
    active = "active"
    permanently_inactive = "permanently_inactive"
    inactive_day_1 = "inactive_day_1"
    inactive_day_2 = "inactive_day_2"
    inactive_day_3 = "inactive_day_3"
    inactive_day_4 = "inactive_day_4"
    inactive_day_5 = "inactive_day_5"
    inactive_day_6 = "inactive_day_6"
    inactive_day_7 = "inactive_day_7"

    @staticmethod
    def increment(status: "ListingActivityStatus"):
        if status == ListingActivityStatus.active:
            return ListingActivityStatus.inactive_day_1
        elif status == ListingActivityStatus.inactive_day_1:
            return ListingActivityStatus.inactive_day_2
        elif status == ListingActivityStatus.inactive_day_2:
            return ListingActivityStatus.inactive_day_3
        elif status == ListingActivityStatus.inactive_day_3:
            return ListingActivityStatus.inactive_day_4
        elif status == ListingActivityStatus.inactive_day_4:
            return ListingActivityStatus.inactive_day_5
        elif status == ListingActivityStatus.inactive_day_5:
            return ListingActivityStatus.inactive_day_6
        elif status == ListingActivityStatus.inactive_day_6:
            return ListingActivityStatus.inactive_day_7
        elif status == ListingActivityStatus.inactive_day_7:
            return ListingActivityStatus.permanently_inactive
        else:
            raise Exception("Invalid activity status")


class CompanyType(str, Enum):
    b2b_saas = "B2B SaaS"
    b2b_community = "B2B Community"
    consumer = "Consumer"
    b2c_marketplace = "B2C Marketplace"
    b2b_marketplace = "B2B Marketplace"
    b2b_services = "B2B Services"
    marketing = "Marketing"
    b2b_ecommerce = "B2B E-commerce"


class Listing(BaseModel):
    id: str
    description: str
    type: Optional[str] = None
    location: str
    messages: Optional[List[Message]] = []
    revenue: Optional[float] = None
    ebitda: Optional[float] = None
    price_low: Optional[float] = None
    price_high: Optional[float] = None
    detailed_description: Optional[str] = None
    funding_raised: Optional[float] = None
    funding_raised: Optional[float] = None
    brokered: bool
    founder_ownership_percent: Optional[int] = None
    annual_growth_percent: Optional[int] = None
    num_employees: Optional[int] = None

    is_test_listing: Optional[bool] = False
    status: Optional[ApprovalStatus] = ApprovalStatus.approved
    profitability: Optional[bool] = False
    gross_margin: Optional[int] = None
    created_at: Optional[str] = None
    activity_status: Optional[ListingActivityStatus] = ListingActivityStatus.active
    approved_at: Optional[str] = None
    competitors: Optional[str] = None
    reason_for_selling: Optional[str] = None
    customer_profile: Optional[str] = None
    seller_intent: Optional[SellerIntent] = None
    preferred_buyer_type: Optional[PreferredBuyerType] = None
    tos: Optional[bool] = False


class ListingWithContactInfo(Listing):
    name: Optional[str] = None
    contact_email: Optional[str] = None
    seller_id: Optional[str] = None
    company_website: Optional[str] = None
    company_name: Optional[str] = None


class AuthorizationResult(BaseModel):
    auth_url: Optional[str] = None
    authorized: bool = False


class RankingMetadata(BaseModel):
    listing_id: str
    response_rate_percentage: Optional[int] = None
    last_activity_timestamp: Optional[int] = None
    active_conversations: int
    new: bool


class Profitability(str, Enum):
    profitable = "profitable"
    not_profitable = "not_profitable"


class Filters(BaseModel):
    user_id: Optional[str] = None
    arr: Optional[List[Optional[int]]] = []
    ebitda: Optional[List[Optional[int]]] = []
    profitability: List[Profitability] = []
    type: List[CompanyType] = []
    alerts: bool = False


class SendbirdMessageSendWebhookPayload(BaseModel):
    message_sender_id: str
    message_recipient_id: Optional[str] = None
    message: str
    channel_url: str


class NewsletterIssue(BaseModel):
    id: int
    content: Optional[str] = None
