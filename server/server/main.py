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
    VellumDocument,
    ProcessingState,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
from models.api import (
    CompleteOnboardingRequest,
    CompleteOnboardingResponse,
    ChatRequest,
    GetDiligenceDocsResponse,
    GetDiligenceDocsRequest,
    GetLoiRequest,
    CreateBusinessRequest,
    CreateLoiRequest,
    GetUsernameRequest,
)
import uuid
from models.models import AppConfig, Business, LOI
from database import Database
import io
import datetime
import pdb
import logging
import sentry_sdk
from webscraper import WebScraper
from recommendations import Recommendations
from email_sender import EmailSender
from ai import AI
from data_connector import DataConnector

sentry_sdk.init(
    dsn="https://d21096400be95ff5557a332e54e828d6@us.sentry.io/4506696496644096",
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
    environment=os.environ.get("ENVIRONMENT"),
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


class IncompleteOnboardingError(Exception):
    pass


class EmptyVectorDatabaseError(Exception):
    pass


class LOINotFoundException(Exception):
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
        )

        response = CompleteOnboardingResponse(success=True)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/create-business")
async def create_business(
    request: CreateBusinessRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        user = await db.get_user(config.user_id)
        business = Business(
            id=str(uuid.uuid4()),
            borrower_id=config.user_id,
            company_name=request.company_name,
            company_website=request.company_website,
            company_state=request.company_state,
            loan_amount=request.loan_amount,
        )
        await db.upsert_business(business=business)

        # update user with phone number
        await db.set_user_fields(config, phone_number=request.phone_number)

        recommendations = Recommendations(db=db)
        lenders = await recommendations.get_recommended_lenders(business=business)
        applications = await db.upsert_loan_applications(
            lenders=lenders, business=business, borrower_id=config.user_id
        )

        FORM_ID = "P780pM"

        form_submission_link = (
            f"https://form.feathery.io/?_slug={FORM_ID}&_id={config.user_id}"
        )
        slack_message = f"New borrower: {user.first_name} {user.last_name} ({user.email}) ({request.phone_number}). Form submission : {form_submission_link}"
        url = "https://hook.us1.make.com/u2j67wjp0oyasths8yp2rl9ak2cxwrz0"
        data = {"message": slack_message}
        response = requests.post(url, json=data)

        return applications
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-recommended-lenders")
async def get_recommended_lenders(
    config: AppConfig = Depends(validate_token),
):
    try:
        businesses = await db.get_businesses_for_user(config.user_id)
        business = businesses[0]

        recommendations = Recommendations(db=db)
        lenders = await recommendations.get_recommended_lenders(business=business)

        return lenders
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-applications")
async def get_applications(
    config: AppConfig = Depends(validate_token),
):
    try:
        businesses = await db.get_businesses_for_user(config.user_id)
        if len(businesses) == 0:
            raise IncompleteOnboardingError()
        business = businesses[0]

        applications = await db.get_loan_applications(business=business)

        if len(applications) == 0:
            recommendations = Recommendations(db=db)
            lenders = await recommendations.get_recommended_lenders(business=business)
            applications = await db.upsert_loan_applications(
                lenders=lenders, business=business, borrower_id=config.user_id
            )

        return applications
    except IncompleteOnboardingError as e:
        raise HTTPException(status_code=401, detail="no business found")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-lenders")
async def get_lenders(
    config: AppConfig = Depends(validate_token),
):
    try:
        lenders = await db.get_lenders()
        return lenders
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/apply-for-loan")
async def apply_for_loan(
    lender_id: str = Form(...),
    under_loi: bool = Form(None),
    linkedin_url: str = Form(None),
    config: AppConfig = Depends(validate_token),
):
    print("applying for loan")
    try:
        businesses = await db.get_businesses_for_user(config.user_id)
        business = businesses[0]

        # check if biz exists yet
        business_complete = business.under_loi is not None
        if not business_complete:
            # check if we have received files

            num_files = await db.num_files_in_bucket(
                user_id=config.user_id, business=business
            )
            if num_files == 0:
                print("no files")
                raise IncompleteOnboardingError()
            else:
                # update business with linkedin_url and under_loi
                business.buyer_linkedin = linkedin_url
                business.under_loi = under_loi
                await db.upsert_business(business=business)

        lender = await db.get_lender(lender_id)

        application = await db.upsert_loan_application(
            business=business, lender=lender, borrower_id=config.user_id
        )

        email_sender = EmailSender()
        print("getting business files")
        business_files = await db.get_business_files(
            user_id=config.user_id, business=business
        )
        # print("business_files", business_files)
        borrower = await db.get_user(config.user_id)
        print("borrower", borrower)
        email_sender.send_application_email(
            business=business,
            borrower=borrower,
            lender=lender,
            business_files=business_files,
        )

        return {"application": application}
    except IncompleteOnboardingError as e:
        raise HTTPException(status_code=401, detail="buyer onboarding required")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-diligence-docs")
async def get_diligence_docs(
    config: AppConfig = Depends(validate_token),
):
    try:
        businesses = await db.get_businesses_for_user(config.user_id)
        business = businesses[0]

        ai = AI()
        vellum_documents = ai.get_vectordb_filenames(
            user_id=config.user_id, business=business
        )
        storage_filepaths = await db.get_diligence_file_paths(
            user_id=config.user_id, business=business
        )

        if len(vellum_documents) == 0:

            cim_filepath = f"{config.user_id}/{business.id}/cim.pdf"
            if cim_filepath in storage_filepaths:
                await ai.vectorize_file(db=db, business=business, filepath=cim_filepath)
                return GetDiligenceDocsResponse(
                    doc=VellumDocument(
                        filename="cim.pdf",
                        filepath=cim_filepath,
                        processing_state=ProcessingState.queued,
                    ),
                    business_id=business.id,
                )
            else:
                return GetDiligenceDocsResponse(doc=None, business_id=business.id)

        return GetDiligenceDocsResponse(
            doc=vellum_documents[0], business_id=business.id
        )

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-quickbooks-status")
async def get_quickbooks_status(
    config: AppConfig = Depends(validate_token),
):
    try:
        data_connector = DataConnector()

        connection = data_connector.get_quickbooks_connection(config.user_id)
        status = False
        if "credentials" in connection:
            status = True

        return {"connected": status}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-diligence-doc-upload-status")
async def get_diligence_doc_upload_status(
    config: AppConfig = Depends(validate_token),
):
    try:

        storage_filepaths = await db.get_diligence_file_paths(user_id=config.user_id)

        print("storage_filepaths", storage_filepaths)
        print("len(storage_filepaths)", len(storage_filepaths))

        return {"uploaded": len(storage_filepaths) == 12}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-lois")
async def get_lois(
    loi_id: str = Body(None),
    config: AppConfig = Depends(validate_token),
):
    try:
        loi = await db.get_lois(
            user_id=config.user_id, loi_id=loi_id if loi_id is not None else None
        )
        return loi
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upsert-loi")
async def upsert_loi(
    request: CreateLoiRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        request_dict = vars(request)
        if request.id is not None:
            loi = await db.get_lois(user_id=config.user_id, loi_id=request.id)
            loi = loi[0]
            for attr, value in request_dict.items():
                if value is not None and attr != "id":
                    setattr(loi, attr, value)
        else:
            loi = LOI(id=str(uuid.uuid4()), created_by=config.user_id, status="draft")
            for attr, value in request_dict.items():
                if value is not None:
                    setattr(loi, attr, value)

        await db.upsert_loi(loi)

        return loi
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/delete-lois")
async def delete_lois(
    loi_ids: List[str] = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        if len(loi_ids) > 0:
            response = await db.delete_lois(loi_ids)
            if len(response) == 0:
                raise LOINotFoundException()
        else:
            raise HTTPException(
                status_code=422, detail="At least one LOI ID must be provided"
            )
        return response
    except LOINotFoundException as e:
        print(e)
        raise HTTPException(
            status_code=404, detail="No LOIs matching the provided IDs were found"
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-username")
async def get_username(
    request: GetUsernameRequest = Body(...),
):
    try:
        user = await db.get_user(request.id)
        return {"username": f"{user.first_name} {user.last_name}"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/geberate-proof-of-cash")
async def generate_proof_of_cash(
    config: AppConfig = Depends(validate_token),
):
    try:
        # Send an alert to slack

        user = await db.get_user(config.user_id)
        slack_message = f"Proof of cash requested: {user.first_name} {user.last_name} ({user.email})."
        url = "https://hook.us1.make.com/u2j67wjp0oyasths8yp2rl9ak2cxwrz0"
        data = {"message": slack_message}

        response = requests.post(url, json=data)

        return {"success": True}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0


def start():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8080, reload=True)
