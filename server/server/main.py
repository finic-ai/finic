import os
import uvicorn
from fastapi import (
    FastAPI,
    File,
    HTTPException,
    Depends,
    Body,
    UploadFile,
    Request,
    status,
    Form,
    Query,
)
from fastapi.exceptions import RequestValidationError

from fastapi.responses import JSONResponse

from typing import List, Optional
from models.models import (
    AppConfig,
    Listing,
    ListingWithContactInfo,
    Message,
    MessageRequest,
    SellerInfo,
    ListingActivityStatus,
    RankingMetadata,
    User,
    BuyerInfo,
    BuyerType,
    UserSource,
    ApprovalStatus,
    SellerIntent,
    PreferredBuyerType,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
from models.api import (
    FetchListingsRequest,
    FetchListingsResponse,
    CompleteOnboardingRequest,
    CompleteOnboardingResponse,
    MessageSellerResponse,
    MessageSellerRequest,
    FetchBuyerInfoResponse,
    CompleteBuyerOnboardingRequest,
    HandleMessageRequestResponse,
    HandleMessageRequestRequest,
    GetMessageRequestsResponse,
    GetFullnameResponse,
    GetListingsByChatChannelUrlRequest,
    CompleteOnboardingWithListingRequest,
    FetchListingFieldResponse,
    UpdateListingFieldRequest,
    HandleScheduledJobsResponse,
    FetchListingWithContactInfoResponse,
    GetUnreadMessageCountResponse,
    GetFiltersResponse,
    UpdateFiltersRequest,
    ApproveListingRequest,
    ApproveListingResponse,
    HandleEmailResponse,
    FetchChatHeaderResponse,
    FetchChatHeaderRequest,
    GenerateDescriptionWithAIResponse,
    GenerateDescriptionWithAIRequest,
)
from ranking_helper import RankingHelper
import uuid
from models.models import AppConfig, Listing, BuyerInfo, ApprovalStatus
from database import Database
from chat import Chat
import io
from email_sender import EmailSender
import datetime
import logging
from scheduled_job_helper import ScheduledJobHelper
import sentry_sdk
from notifications_manager import NotificationsManager
from ai import AI

sentry_sdk.init(
    dsn="https://d21096400be95ff5557a332e54e828d6@us.sentry.io/4506696496644096",
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
    environment=os.environ.get("SENTRY_ENVIRONMENT"),
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the list of allowed origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer_scheme = HTTPBearer()
db = Database()


class SubscriptionRequiredError(Exception):
    pass


class IncompleteOnboardingError(Exception):
    pass


class ListingAlreadyApprovedError(Exception):
    pass


class InvalidSendbirdWebhookSignatureError(Exception):
    pass


class SendbirdWebhookNoRecipientError(Exception):
    pass


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f"{exc}".replace("\n", " ").replace("   ", " ")
    logging.error(f"{request}: {exc_str}")
    content = {"status_code": 10422, "message": exc_str, "data": None}
    return JSONResponse(
        content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
    )


async def validate_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    try:
        print("credentials.credentials", credentials.credentials)
        app_config = await db.get_config(credentials.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or missing public key")
    if credentials.scheme != "Bearer" or app_config is None:
        raise HTTPException(status_code=401, detail="Invalid or missing public key")
    return app_config


async def validate_optional_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    try:
        print("credentials.credentials", credentials.credentials)
        app_config = await db.get_config(credentials.credentials)
    except Exception:
        return None
    if credentials.scheme != "Bearer" or app_config is None:
        return None
    return app_config


@app.post(
    "/fetch-listings",
    response_model=FetchListingsResponse,
)
async def get_listings(
    request: FetchListingsRequest = Body(...),
    config: AppConfig = Depends(validate_optional_token),
):
    try:
        listing_id = request.listing_id
        if listing_id is not None:
            listing = await db.get_listing_with_contact_info(listing_id=listing_id)
            listings = [listing]
        else:
            listings = await db.get_listings_with_contact_info()

        # filter out test listings
        if config and not config.user_id in [
            "058b8065-0a23-46b5-adfa-9ef11e83eedc",
            "969dc3d4-ce38-4346-af86-efb7b857d43d",
            "6718cb08-89c0-4dfc-bd7d-080f04dfb3b2",
        ]:
            listings = [listing for listing in listings if not listing.is_test_listing]

        print("listings retrieved")

        ranking_helper = RankingHelper()

        if config is not None:
            seller_info = await db.get_seller_info(user_id=config.user_id)
            buyer_info = await db.get_buyer_info(user_id=config.user_id)

            print("retreived seller and buyer info")

            listings = ranking_helper.filter_unapproved_listings(
                listings=listings, seller_info=seller_info, buyer_info=buyer_info
            )

        print("filtered by approval status")

        # filter out inactive listings
        listings = [
            listing
            for listing in listings
            if listing.activity_status != ListingActivityStatus.permanently_inactive
        ]

        if request.use_filters and config is not None:
            filters = request.filters
            if filters is None:
                filters = await db.get_filters(config=config)
            listings = ranking_helper.filter_listings(
                listings=listings, filters=filters
            )
        ranked_listings, ranking_metadata = ranking_helper.rank_listings(
            listings=listings
        )

        # remove the messages before returning unless the user is the seller and this is their listing
        # or the user is the buyer and they have messaged this listing
        if config is None:
            for listing in ranked_listings:
                listing.messages = []
        else:
            for listing in ranked_listings:
                if listing.seller_id == config.user_id:
                    continue
                else:
                    listing.messages = [
                        msg
                        for msg in listing.messages
                        if msg.sender_app_id == config.app_id
                    ]

        # cast down to Listing
        ranked_listings = [Listing(**listing.dict()) for listing in ranked_listings]

        response = FetchListingsResponse(
            result=ranked_listings,
            ranking_metadata=ranking_metadata,
        )
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/fetch-listings-for-seller",
    response_model=FetchListingsResponse,
)
async def get_listings_for_seller(config: AppConfig = Depends(validate_token)):
    try:
        seller_info = await db.get_seller_info(user_id=config.user_id)
        if seller_info is None:
            return FetchListingsResponse(result=[])
        listings = await db.get_listings(listing_ids=seller_info.listings)
        response = FetchListingsResponse(result=listings)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-chat-header",
    response_model=FetchChatHeaderResponse,
)
async def get_chat_header(
    request: FetchChatHeaderRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        channel_url = request.channel_url

        my_user_id = config.user_id
        buyer_id, seller_id = Chat().get_buyer_and_seller_from_channel_url(
            channel_url=channel_url
        )
        user_is_buyer = my_user_id == seller_id
        if my_user_id == buyer_id:
            user_id = seller_id
        else:
            user_id = buyer_id
        user = await db.get_user_by_id(user_id=user_id)

        print("user", user)
        if user is None:
            return FetchChatHeaderResponse()
        elif not user_is_buyer:
            return FetchChatHeaderResponse(calendar_link=user.calendar_link)
        else:
            buyer_info = await db.get_buyer_info(user_id=user_id)
            print("buyer_info", buyer_info)
            return FetchChatHeaderResponse(
                linkedin_url=buyer_info.linkedin_profile,
                calendar_link=user.calendar_link,
            )

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/fetch-listings-for-buyer",
    response_model=FetchListingsResponse,
)
async def get_listings_for_buyer(config: AppConfig = Depends(validate_token)):
    try:
        buyer_info = await db.get_buyer_info(user_id=config.user_id)
        if buyer_info is None:
            return FetchListingsResponse(result=[])
        listings = await db.get_listings(listing_ids=buyer_info.listings_messaged)
        print("listings", listings)
        response = FetchListingsResponse(result=listings)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-unread-message-count",
    response_model=GetUnreadMessageCountResponse,
)
async def get_unread_message_count(config: AppConfig = Depends(validate_token)):
    try:
        count = await Chat().get_unread_message_count(user_id=config.user_id)
        response = GetUnreadMessageCountResponse(result=count)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/fetch-listing-with-contact-info",
    response_model=FetchListingWithContactInfoResponse,
)
async def get_listing_with_contact_info(
    request: FetchListingsRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        listing = await db.get_listing_with_contact_info(listing_id=request.listing_id)

        if listing is None or listing.seller_id != config.user_id:
            return FetchListingWithContactInfoResponse(result=None)

        response = FetchListingWithContactInfoResponse(result=listing)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/update-listing-field",
    response_model=FetchListingFieldResponse,
)
async def update_listing_field(
    request: UpdateListingFieldRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        listing = await db.get_listing_with_contact_info(listing_id=request.listing_id)
        if not listing.seller_id == config.user_id:
            raise HTTPException(status_code=400, detail="listing not owned by user")

        value = request.value
        if request.field == "seller_intent":
            value = SellerIntent.from_string(value)
        elif request.field == "preferred_buyer_type":
            value = PreferredBuyerType.from_string(value)
        setattr(listing, request.field, value)
        await db.upsert_listing(listing=listing)
        response = FetchListingFieldResponse(result=getattr(listing, request.field))
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/fetch-buyer-info",
    response_model=FetchBuyerInfoResponse,
)
async def fetch_buyer_info(
    config: AppConfig = Depends(validate_token),
):
    try:
        buyer_info = db.get_buyer_info(config.app_id)
        return FetchBuyerInfoResponse(result=buyer_info)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/message-seller",
    response_model=MessageSellerResponse,
)
async def message_seller(
    request: MessageSellerRequest = Body(...),
    config: Optional[AppConfig] = Depends(validate_optional_token),
):
    try:
        message = request.message
        listing = await db.get_listing_with_contact_info(listing_id=request.listing_id)

        seller_id = listing.seller_id

        buyer = await db.get_user(app_id=config.app_id)
        buyer_info = await db.get_buyer_info(user_id=config.user_id)
        seller = await db.get_user_by_id(user_id=seller_id)

        if (
            buyer_info is None
            or not buyer_info.first_name
            or not buyer_info.last_name
            or not buyer_info.linkedin_profile
            or not buyer_info.buyer_type
            or buyer_info.approval_status == ApprovalStatus.not_submitted
        ):
            print("onboarding required error")
            raise IncompleteOnboardingError()

        message_to_add = Message(
            message=message,
            sender_app_id=config.app_id,
            sender_user_id=config.user_id,
            pending=True,
            accepted=False,
            sent_at=int(datetime.datetime.now().timestamp()),
        )

        await db.add_message_to_listing(
            app_config=config,
            message=message_to_add,
            listing=listing,
            buyer_info=buyer_info,
        )

        print("added message")

        if not buyer_info.approval_status == ApprovalStatus.approved:
            resulting_listing = Listing(**listing.dict())
            resulting_listing.messages = [message_to_add]
            return MessageSellerResponse(listing=resulting_listing)

        print("buyer is approved", buyer_info)

        NotificationsManager().send_message_request_notification(
            seller=seller,
            buyer=buyer,
            listing=listing,
            buyer_info=buyer_info,
            message=message,
        )

        resulting_listing = Listing(**listing.dict())
        resulting_listing.messages = [message_to_add]

        response = MessageSellerResponse(listing=resulting_listing)
        return response
    except SubscriptionRequiredError as e:
        raise HTTPException(status_code=400, detail="subscription required")
    except IncompleteOnboardingError as e:
        raise HTTPException(status_code=401, detail="buyer onboarding required")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/complete-onboarding",
    response_model=CompleteOnboardingResponse,
)
async def complete_onboarding(
    request: CompleteOnboardingRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        print("complete onboarding", request.is_seller)
        user = await db.set_user_fields(
            config,
            is_seller=request.is_seller,
            completed_onboarding=True,
            first_name=request.first_name,
            last_name=request.last_name,
            calendar_link=request.calendar_link,
            source=UserSource.from_string(request.source),
            utm_source=request.utm_source,
        )

        form_submission_link = (
            f"https://form.feathery.io/?_slug=MFchVx&_id={config.user_id}"
        )

        if request.is_seller:

            seller_info = SellerInfo(
                user_id=config.user_id,
                first_name=request.first_name,
                last_name=request.last_name,
                listings=[],
            )
            await db.upsert_seller_info(seller_info=seller_info)
            slack_message = f"New seller: {request.first_name} {request.last_name} ({user.email}). Form submission : {form_submission_link}"
            url = "https://hook.us1.make.com/ckl2ii0tvjoa17yeiq1rgjbbjnqst9n4"
        else:
            buyer_info = BuyerInfo(
                user_id=config.user_id,
                listings_messaged=[],
                first_name=request.first_name,
                last_name=request.last_name,
                linkedin_profile=None,
                company_name=None,
                company_website=None,
                whitelisted=False,
            )

            await db.upsert_buyer_info(buyer_info=buyer_info)
            sender = EmailSender()
            sender.send_buyer_onboarding_email(
                to=user.email,
                first_name=request.first_name,
            )
            slack_message = f"New buyer: {request.first_name} {request.last_name} ({user.email}). Form submission : {form_submission_link}"
            url = "https://hook.us1.make.com/u2j67wjp0oyasths8yp2rl9ak2cxwrz0"

        data = {"message": slack_message}

        response = requests.post(url, json=data)

        response = CompleteOnboardingResponse(success=True)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/complete-onboarding-with-listing",
    response_model=CompleteOnboardingResponse,
)
async def complete_onboarding_with_listing(
    request: CompleteOnboardingWithListingRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        listing = await db.get_listing_with_contact_info(listing_id=request.listing_id)

        user = await db.set_user_fields(
            config,
            is_seller=True,
            completed_onboarding=True,
            first_name=listing.name.split(" ")[0],
            last_name=listing.name.split(" ")[1],
        )

        if listing.seller_id:
            raise HTTPException(status_code=400, detail="listing already claimed")

        await db.upsert_seller_info(
            seller_info=SellerInfo(
                user_id=config.user_id,
                first_name=listing.name.split(" ")[0],
                last_name=listing.name.split(" ")[1],
                listings=[listing.id],
            )
        )

        listing.seller_id = config.user_id
        listing.contact_email = user.email
        await db.upsert_listing_with_contact_info(
            listing=listing
        )  # update the listing with the seller id

        slack_message = f"New seller: {user.full_name} ({user.email}). Onboarding with listing link: {listing.description}"
        url = "https://hook.us1.make.com/ckl2ii0tvjoa17yeiq1rgjbbjnqst9n4"

        data = {"message": slack_message}

        response = requests.post(url, json=data)

        response = CompleteOnboardingResponse(success=True)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/submit-listing-for-approval",
    response_model=CompleteOnboardingResponse,
)
async def submit_listing_for_approval(
    request: CompleteOnboardingWithListingRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        listing = await db.get_listing_with_contact_info(listing_id=request.listing_id)

        if listing.seller_id != config.user_id:
            raise HTTPException(status_code=400, detail="listing not owned by user")

        listing.status = ApprovalStatus.under_review
        await db.upsert_listing_with_contact_info(listing=listing)

        slack_message = f"New listing pending approval: {listing.description}"
        slack_message += f"\nSupabase link: https://supabase.com/dashboard/project/gbifoxptaqxnlrfucmfo/editor/39936?filter=id%3Aeq%3A{listing.id}"
        slack_message += f"\nApproval link: https://dealwise-marketplace-ezml2kwdva-uc.a.run.app/approve-listing?listing_id={listing.id}&bearer=d4e459ca-b9a7-4403-af08-d21759681c5b"
        url = "https://hook.us1.make.com/x1u8260u0ydrxha1lhj71ab3q0pn7tbs"

        data = {"message": slack_message}

        response = requests.post(url, json=data)

        response = CompleteOnboardingResponse(success=True)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/create-new-listing",
    response_model=CompleteOnboardingWithListingRequest,
)
async def create_new_listing(
    config: AppConfig = Depends(validate_token),
):
    try:
        user = await db.get_user_by_id(user_id=config.user_id)
        seller_info = await db.get_seller_info(user_id=config.user_id)

        new_listing = ListingWithContactInfo(
            id=str(uuid.uuid4()),
            description="",
            type="",
            location="",
            revenue=None,
            ebitda=None,
            profitability=False,
            funding_raised=None,
            founder_ownership_percent=None,
            brokered=False,
            status=ApprovalStatus.not_submitted,
            name=f"{seller_info.first_name} {seller_info.last_name}",
            contact_email=user.email,
            seller_id=config.user_id,
            company_website=None,
            company_name=None,
            activity_status=ListingActivityStatus.active,
        )

        await db.upsert_listing_with_contact_info(listing=new_listing)

        seller_info.listings.append(new_listing.id)
        await db.upsert_seller_info(seller_info=seller_info)

        response = CompleteOnboardingWithListingRequest(listing_id=new_listing.id)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/complete-buyer-onboarding",
    response_model=MessageSellerResponse,
)
async def complete_buyer_onboarding(
    request: CompleteBuyerOnboardingRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        await db.set_user_fields(
            config,
            first_name=request.first_name,
            last_name=request.last_name,
            calendar_link=request.calendar_link,
        )

        original_buyer_info = await db.get_buyer_info(user_id=config.user_id)

        listings_messaged = []
        whitelisted = False
        approval_status = ApprovalStatus.under_review
        if original_buyer_info is not None:
            listings_messaged = original_buyer_info.listings_messaged
            whitelisted = original_buyer_info.whitelisted
            if original_buyer_info.approval_status == ApprovalStatus.approved:
                approval_status = ApprovalStatus.approved

        buyer_info = BuyerInfo(
            user_id=config.user_id,
            listings_messaged=listings_messaged,
            first_name=request.first_name,
            last_name=request.last_name,
            linkedin_profile=request.linkedin_profile,
            company_name=request.company_name,
            company_website=request.company_website,
            whitelisted=whitelisted,
            approval_status=approval_status,
            buyer_type=BuyerType.from_label(request.buyer_type),
        )

        if (
            not original_buyer_info
            or original_buyer_info.approval_status == ApprovalStatus.not_submitted
        ):
            buyer = await db.get_user(app_id=config.app_id)
            NotificationsManager().send_buyer_approval_required_notification(
                buyer_info=buyer_info,
                buyer=buyer,
            )

        await db.upsert_buyer_info(buyer_info=buyer_info)

        response = await message_seller(
            MessageSellerRequest(
                message=request.message,
                listing_id=request.listing_id,
            ),
            config=config,
        )

        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/accept-message-request",
    response_model=HandleMessageRequestResponse,
)
async def accept_message_request(
    request: HandleMessageRequestRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        listing_id = request.listing_id
        listing = await db.get_listing_with_contact_info(listing_id=listing_id)
        message_text = ""
        for message in listing.messages:
            if message.sender_user_id == request.message_sender_user_id:
                message.pending = False
                message.accepted = True
                message.responded_at = int(datetime.datetime.now().timestamp())
                message_text = message.message
                break

        print(listing.messages)

        # upsert the listing
        listing.activity_status = ListingActivityStatus.active
        await db.upsert_listing(listing=listing)

        buyer_info = await db.get_buyer_info(user_id=request.message_sender_user_id)
        # create the group channel in sendbird and send the message

        seller_info = await db.get_seller_info(user_id=config.user_id)

        chat = Chat()
        await chat.create_channel(
            buyer_user_id=request.message_sender_user_id,
            seller_user_id=config.user_id,
            buyer_name=f"{buyer_info.first_name} {buyer_info.last_name}",
            seller_name=f"{seller_info.first_name} {seller_info.last_name}",
            listing_name=listing.description,
            listing_id=listing_id,
        )

        await chat.send_message_from_buyer_to_seller(
            buyer_id=request.message_sender_user_id,
            seller_id=config.user_id,
            message=message_text,
        )

        email_sender = EmailSender()

        buyer = await db.get_user_by_id(user_id=request.message_sender_user_id)
        seller = await db.get_user_by_id(user_id=config.user_id)
        email_sender.send_seller_responded_to_request_email(
            buyer_email=buyer.email,
            seller_email=seller.email,
            accepted=True,
            buyer_first_name=buyer_info.first_name,
            seller_first_name=seller_info.first_name,
            seller_full_name=f"{seller_info.first_name} {seller_info.last_name}",
            seller_company_name=listing.company_name,
            listing_name=listing.description,
        )

        response = HandleMessageRequestResponse(success=True)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/ignore-message-request",
    response_model=HandleMessageRequestResponse,
)
async def ignore_message_request(
    request: HandleMessageRequestRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        listing_id = request.listing_id
        listing = await db.get_listing_with_contact_info(listing_id=listing_id)
        for message in listing.messages:
            if message.sender_user_id == request.message_sender_user_id:
                message.pending = False
                message.accepted = False
                message.responded_at = int(datetime.datetime.now().timestamp())
                break

        # upsert the listing
        listing.activity_status = ListingActivityStatus.active
        await db.upsert_listing(listing=listing)

        email_sender = EmailSender()
        buyer_info = await db.get_buyer_info(user_id=request.message_sender_user_id)
        # create the group channel in sendbird and send the message

        seller_info = await db.get_seller_info(user_id=config.user_id)
        buyer = await db.get_user_by_id(user_id=request.message_sender_user_id)
        seller = await db.get_user_by_id(user_id=config.user_id)
        email_sender.send_seller_responded_to_request_email(
            buyer_email=buyer.email,
            seller_email=seller.email,
            accepted=False,
            buyer_first_name=buyer_info.first_name,
            seller_first_name=seller_info.first_name,
            seller_full_name=f"{seller_info.first_name} {seller_info.last_name}",
            seller_company_name=listing.company_name,
            listing_name=listing.description,
        )

        response = HandleMessageRequestResponse(success=True)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-incoming-message-requests",
    response_model=GetMessageRequestsResponse,
)
async def get_incoming_message_requests(
    config: AppConfig = Depends(validate_token),
):
    try:
        seller_info = await db.get_seller_info(user_id=config.user_id)
        if seller_info is None:
            return GetMessageRequestsResponse(result=[])
        listing_ids = seller_info.listings
        if len(listing_ids) == 0:
            return GetMessageRequestsResponse(result=[])

        listings = await db.get_listings(listing_ids=listing_ids)

        message_requests = []

        for listing in listings:
            should_update_listing = False
            for message in listing.messages:
                if not message.sender_user_id:
                    # use the app id to get the user id
                    sender = await db.get_user(app_id=message.sender_app_id)
                    if sender is None:
                        print("nonexistent sender", sender)
                        continue
                    should_update_listing = True
                    message.sender_user_id = sender.id
                buyer_info = await db.get_buyer_info(user_id=message.sender_user_id)

                if buyer_info is None or not buyer_info.first_name:
                    continue

                if buyer_info.approval_status != ApprovalStatus.approved:
                    continue

                print("buyer_info", buyer_info)
                message_request = MessageRequest(
                    listing_id=listing.id,
                    listing_name=listing.description,
                    message=message,
                    message_sender_full_name=f"{buyer_info.first_name} {buyer_info.last_name}",
                    message_sender_linkedin_profile=buyer_info.linkedin_profile,
                    message_sender_company_name=buyer_info.company_name,
                    message_sender_company_website=buyer_info.company_website,
                )
                message_requests.append(message_request)
            if should_update_listing:
                await db.upsert_listing(listing=listing)

        response = GetMessageRequestsResponse(result=message_requests)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-outgoing-message-requests",
    response_model=GetMessageRequestsResponse,
)
async def get_outgoing_message_requests(
    config: AppConfig = Depends(validate_token),
):
    try:
        buyer_info = await db.get_buyer_info(user_id=config.user_id)
        if buyer_info is None:
            return GetMessageRequestsResponse(result=[])
        listing_ids = buyer_info.listings_messaged
        if len(listing_ids) == 0:
            return GetMessageRequestsResponse(result=[])

        listings = await db.get_listings(listing_ids=listing_ids)

        print("listings", listings)

        message_requests = []

        for listing in listings:
            should_update_listing = False
            for message in listing.messages:
                if not message.sender_user_id:
                    # use the app id to get the user id
                    sender = await db.get_user(app_id=message.sender_app_id)
                    if sender is None:
                        print("nonexistent sender", sender)
                        continue
                    message.sender_user_id = sender.id
                    should_update_listing = True
                if message.sender_user_id == config.user_id:
                    print("hello")
                    buyer_info = await db.get_buyer_info(user_id=message.sender_user_id)
                    message_request = MessageRequest(
                        listing_id=listing.id,
                        listing_name=listing.description,
                        message=message,
                        message_sender_full_name=f"{buyer_info.first_name} {buyer_info.last_name}",
                        message_sender_linkedin_profile=buyer_info.linkedin_profile,
                        message_sender_company_name=buyer_info.company_name,
                        message_sender_company_website=buyer_info.company_website,
                    )
                    message_requests.append(message_request)

            if should_update_listing:
                await db.upsert_listing(listing=listing)

        print(message_requests)
        response = GetMessageRequestsResponse(result=message_requests)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-fullname",
    response_model=GetFullnameResponse,
)
async def get_fullname(
    config: AppConfig = Depends(validate_token),
):
    try:
        user = await db.get_user_by_id(user_id=config.user_id)
        if user.first_name and user.last_name:
            return GetFullnameResponse(result=f"{user.first_name} {user.last_name}")
        elif user.is_seller:
            seller_info = await db.get_seller_info(user_id=config.user_id)
            response = GetFullnameResponse(
                result=f"{seller_info.first_name} {seller_info.last_name}"
            )
            return response
        else:
            buyer_info = await db.get_buyer_info(user_id=config.user_id)
            response = GetFullnameResponse(
                result=f"{buyer_info.first_name} {buyer_info.last_name}"
            )
            return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-listings-by-chat-channel-url",
    response_model=FetchListingsResponse,
)
async def get_listings_by_chat_channel_url(
    request: GetListingsByChatChannelUrlRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        if not request.channel_url:
            return FetchListingsResponse(result=[])
        buyer_id, seller_id = Chat().get_buyer_and_seller_from_channel_url(
            request.channel_url
        )
        seller_info = await db.get_seller_info(user_id=seller_id)
        listings = await db.get_listings(listing_ids=seller_info.listings)

        buyer_contacted_listings = []

        for listing in listings:
            for message in listing.messages:
                if message.sender_user_id == buyer_id:
                    listing.messages = [message]
                    buyer_contacted_listings.append(listing)
                    break

        if len(buyer_contacted_listings) == 0:
            return FetchListingsResponse(result=listings)
        else:
            return FetchListingsResponse(result=buyer_contacted_listings)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/handle-inactive-listings",
    response_model=HandleScheduledJobsResponse,
)
async def handle_inactive_listings():
    try:
        helper = ScheduledJobHelper(db=db)
        # to be run every day
        await helper.handle_inactive_listings()

        return HandleScheduledJobsResponse(
            success=True,
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/handle-pending-message-request-reminders",
    response_model=HandleScheduledJobsResponse,
)
async def handle_pending_message_request_reminders():
    try:
        helper = ScheduledJobHelper(db=db)
        await helper.handle_pending_message_request_reminders()

        return HandleScheduledJobsResponse(
            success=True,
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/handle-unread-message-reminders",
    response_model=HandleScheduledJobsResponse,
)
async def handle_unread_message_reminders():
    try:
        helper = ScheduledJobHelper(db=db)
        await helper.handle_unread_message_reminders()

        return HandleScheduledJobsResponse(
            success=True,
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/generate-newsletter",
    response_model=HandleScheduledJobsResponse,
)
async def generate_newsletter():
    try:
        helper = ScheduledJobHelper(db=db)
        await helper.generate_newsletter()

        return HandleScheduledJobsResponse(
            success=True,
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-filters",
    response_model=GetFiltersResponse,
)
async def get_filters(
    config: AppConfig = Depends(validate_token),
):
    try:
        filters = await db.get_filters(config=config)
        return GetFiltersResponse(
            result=filters,
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/update-filters",
    response_model=GetFiltersResponse,
)
async def update_filters(
    request: UpdateFiltersRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        filters = request.filters
        filters.user_id = config.user_id
        filters = await db.upsert_filters(filters=request.filters)
        return GetFiltersResponse(result=filters)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/approve-listing",
    response_model=ApproveListingResponse,
)
async def approve_listing(
    listing_id: str = Query(...),
    bearer: str = Query(...),
):
    try:
        # check auth headers to make sure the bearer is d4e459ca-b9a7-4403-af08-d21759681c5b

        # example localhost:8080/approve-listing?listing_id=f6bb0a25-5347-4db4-8342-31df0ec29fe9&bearer=d4e459ca-b9a7-4403-af08-d21759681c5b

        if bearer != "d4e459ca-b9a7-4403-af08-d21759681c5b":
            raise HTTPException(status_code=401, detail="unauthorized")

        listing = await db.get_listing_with_contact_info(listing_id=listing_id)

        if listing.status == ApprovalStatus.approved:
            print("already approved")
            raise ListingAlreadyApprovedError()

        never_approved_before = listing.approved_at is None
        listing = await db.approve_listing(
            listing_id=listing_id, should_set_approved_at=never_approved_before
        )
        email_sender = EmailSender()
        seller = await db.get_user_by_id(user_id=listing.seller_id)
        await email_sender.send_listing_approved_email(
            to=seller.email,
            listing=listing,
        )

        if never_approved_before:
            users_with_matching_filters = await db.get_users_with_matching_filters(
                listing
            )
            await email_sender.send_new_listing_alert_emails(
                listing=listing,
                users=users_with_matching_filters,
            )

        response = ApproveListingResponse(approval_status=listing.status, success=True)
        return response
    except ListingAlreadyApprovedError as e:
        raise HTTPException(status_code=400, detail="Listing already approved")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/approve-buyer", response_model=ApproveListingResponse)
async def approve_buyer(
    user_id: str = Query(...),
    bearer: str = Query(...),
):
    try:
        # check auth headers to make sure the bearer is d4e459ca-b9a7-4403-af08-d21759681c5b

        # example localhost:8080/approve-buyer?user_id=f6bb0a25-5347-4db4-8342-31df0ec29fe9&bearer=d4e459ca-b9a7-4403-af08-d21759681c5b

        if bearer != "d4e459ca-b9a7-4403-af08-d21759681c5b":
            raise HTTPException(status_code=401, detail="unauthorized")

        buyer_info = await db.get_buyer_info(user_id=user_id)

        if buyer_info.approval_status == ApprovalStatus.approved:
            print("already approved")
            raise ListingAlreadyApprovedError()

        buyer_info = await db.approve_buyer(user_id=user_id)

        buyer = await db.get_user_by_id(user_id=user_id)

        # send out notifications for messages

        print("sending out notifications for messages")

        listings = await db.get_listings_with_contact_info(
            listing_ids=buyer_info.listings_messaged
        )

        print("listings", listings)
        for listing in listings:

            messages = [
                msg for msg in listing.messages if msg.sender_app_id == buyer.app_id
            ]
            if len(messages) == 0:
                continue
            message = messages[0].message

            # skip if it's not pending
            if not messages[0].pending:
                continue

            seller = await db.get_user_by_id(user_id=listing.seller_id)
            print("seller", seller)
            NotificationsManager().send_message_request_notification(
                seller=seller,
                buyer=buyer,
                listing=listing,
                buyer_info=buyer_info,
                message=message,
            )

        response = ApproveListingResponse(
            approval_status=buyer_info.approval_status, success=True
        )
        return response
    except ListingAlreadyApprovedError as e:
        raise HTTPException(status_code=400, detail="Buyer already approved")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0


@app.post("/messaging-email-received", response_model=HandleEmailResponse)
async def messaging_email_received(
    request: Request,
    # attachments: Optional[list[UploadFile]] = File(None),
):
    print("Email Received:")
    form_data = await request.form()
    print(form_data)

    email_sender = EmailSender()

    email_address, channel_url, message, recipient_id = (
        email_sender.parse_email_received_webhook(form_data)
    )

    user = await db.get_user_by_id(user_id=recipient_id)
    if not user:
        user = await db.get_user_by_email(email=email_address)

    chat = Chat()

    await chat.send_message_in_channel(
        channel_url=channel_url, user_id=user.id, message=message
    )

    return HandleEmailResponse(success=True)


async def get_name_for_user(user: User):
    if user.first_name and user.last_name:
        return user.first_name, user.last_name
    elif user.full_name:
        return user.full_name.split(" ")

    if user.is_seller:
        seller_info = await db.get_seller_info(user_id=user.id)
        return seller_info.first_name, seller_info.last_name
    else:
        buyer_info = await db.get_buyer_info(user_id=user.id)
        return buyer_info.first_name, buyer_info.last_name


@app.post("/sendbird-message-received", response_model=HandleEmailResponse)
async def sendbird_message_received(
    request: Request,
    payload: dict = Body(...),
):
    try:
        chat = Chat()
        # check the signature from the webhook
        valid = await chat.signature_is_valid(request)
        if not valid:
            raise InvalidSendbirdWebhookSignatureError()

        parsed_payload = chat.parse_message_send_webhook(payload)

        if not parsed_payload.message_recipient_id:
            raise SendbirdWebhookNoRecipientError()

        sender = await db.get_user_by_id(user_id=parsed_payload.message_sender_id)
        recipient = await db.get_user_by_id(user_id=parsed_payload.message_recipient_id)

        email_sender = EmailSender()

        sender_first_name, sender_last_name = await get_name_for_user(sender)
        recipient_first_name, _ = await get_name_for_user(recipient)

        await email_sender.send_chat_message_received_email(
            to=recipient.email,
            sender_first_name=sender_first_name,
            sender_full_name=f"{sender_first_name} {sender_last_name}",
            recipient_id=recipient.id,
            recipient_first_name=recipient_first_name,
            message=parsed_payload.message,
            channel_url=parsed_payload.channel_url,
        )

        return HandleEmailResponse(success=True)
    except InvalidSendbirdWebhookSignatureError as e:
        raise HTTPException(status_code=401, detail="unauthorized")
    except SendbirdWebhookNoRecipientError as e:
        raise HTTPException(status_code=400, detail="no recipient id")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/generate-description-with-ai", response_model=GenerateDescriptionWithAIResponse
)
async def generate_description_with_ai(
    request: GenerateDescriptionWithAIRequest = Body(...),
):
    try:
        url = request.website_url
        description = await AI().generate_description(url)
        return GenerateDescriptionWithAIResponse(result=description)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


def start():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8080, reload=True)
