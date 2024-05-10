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
    Business,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
from models.api import (
    CompleteOnboardingRequest,
    CompleteOnboardingResponse,
)
import uuid
from models.models import AppConfig, Business
from database import Database
import io
import datetime
import logging
import sentry_sdk

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
    "/complete-onboarding",
    response_model=CompleteOnboardingResponse,
)
async def complete_onboarding(
    request: CompleteOnboardingRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        user = await db.set_user_fields(
            config,
            completed_onboarding=True,
            first_name=request.first_name,
            last_name=request.last_name,
            type=request.applicant_type,
        )

        business = Business(
            id=str(uuid.uuid4()),
            borrower_id=user.id,
            buyer_first_name=(
                user.first_name
                if request.applicant_type == "acquirer"
                else request.buyer_first_name
            ),
            buyer_last_name=(
                user.last_name
                if request.applicant_type == "acquirer"
                else request.buyer_last_name
            ),
            buyer_email=(
                user.email
                if request.applicant_type == "acquirer"
                else request.buyer_email
            ),
            buyer_linkedin=request.buyer_linkedin,
            owner_first_name=(
                user.first_name
                if request.applicant_type == "business_owner"
                else request.first_name
            ),
            owner_last_name=(
                user.first_name
                if request.applicant_type == "business_owner"
                else request.first_name
            ),
            owner_email=(
                user.email
                if request.applicant_type == "business_owner"
                else request.owner_email
            ),
            company_name=request.company_name,
            company_website=request.company_website,
        )
        await db.upsert_business(business=business)

        form_submission_link = (
            f"https://form.feathery.io/?_slug=bZapMh&_id={config.user_id}"
        )
        slack_message = f"New borrower: {request.first_name} {request.last_name} ({user.email}). Form submission : {form_submission_link}"
        url = "https://hook.us1.make.com/u2j67wjp0oyasths8yp2rl9ak2cxwrz0"
        data = {"message": slack_message}
        response = requests.post(url, json=data)

        response = CompleteOnboardingResponse(success=True)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0


def start():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8080, reload=True)
