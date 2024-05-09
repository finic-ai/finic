from typing import List, Optional, Any
from models.models import (
    ListingWithContactInfo,
    Listing,
    BuyerInfo,
    MessageRequest,
    RankingMetadata,
    Filters,
    ApprovalStatus,
)
from pydantic import BaseModel


class FetchListingsResponse(BaseModel):
    result: List[Listing] = []
    ranking_metadata: Optional[List[RankingMetadata]] = []


class FetchListingWithContactInfoResponse(BaseModel):
    result: Optional[ListingWithContactInfo] = None


class FetchListingFieldResponse(BaseModel):
    result: Any = None


class FetchBuyerInfoResponse(BaseModel):
    result: Optional[BuyerInfo] = None


class FetchListingsRequest(BaseModel):
    listing_id: Optional[str] = None
    include_unapproved_listings: Optional[bool] = False
    filters: Optional[Filters] = None
    use_filters: Optional[bool] = False


class UpdateListingFieldRequest(BaseModel):
    listing_id: str
    field: str
    value: Any


class CompleteOnboardingRequest(BaseModel):
    is_seller: bool
    first_name: str
    last_name: str
    calendar_link: Optional[str] = None
    source: str
    utm_source: Optional[str] = None


class CompleteOnboardingResponse(BaseModel):
    success: bool


class ApproveListingResponse(BaseModel):
    success: bool
    approval_status: ApprovalStatus


class HandleScheduledJobsResponse(BaseModel):
    success: bool


class GetFiltersResponse(BaseModel):
    result: Optional[Filters] = None


class UpdateFiltersRequest(BaseModel):
    filters: Filters


class CompleteOnboardingWithListingRequest(BaseModel):
    listing_id: str


class ApproveListingRequest(BaseModel):
    listing_id: str


class MessageSellerResponse(BaseModel):
    listing: Listing


class MessageSellerRequest(BaseModel):
    message: str
    listing_id: str


class CompleteBuyerOnboardingRequest(MessageSellerRequest):
    first_name: str
    last_name: str
    linkedin_profile: Optional[str]
    company_name: str
    company_website: Optional[str]
    buyer_type: str
    calendar_link: Optional[str]


class HandleMessageRequestResponse(BaseModel):
    success: bool


class HandleMessageRequestRequest(BaseModel):
    listing_id: str
    message_sender_user_id: str


class GetMessageRequestsResponse(BaseModel):
    result: List[MessageRequest] = []


class GetFullnameResponse(BaseModel):
    result: str = ""


class GetUnreadMessageCountResponse(BaseModel):
    result: int


class GetListingsByChatChannelUrlRequest(BaseModel):
    channel_url: str


class HandleEmailResponse(BaseModel):
    success: bool


class FetchChatHeaderResponse(BaseModel):
    linkedin_url: Optional[str] = None
    calendar_link: Optional[str] = None


class FetchChatHeaderRequest(BaseModel):
    channel_url: str


class GenerateDescriptionWithAIResponse(BaseModel):
    result: str = ""


class GenerateDescriptionWithAIRequest(BaseModel):
    website_url: str
