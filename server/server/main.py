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
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
from models.api import (
    GetJobRequest,
    GetExecutionRequest,
    DeployJobRequest,
)
import uuid
from models.models import AppConfig, Job, JobStatus
from database import Database
import io
import datetime
import pdb
import logging
import sentry_sdk
from workflow_job_runner import WorkflowJobRunner
import json
from job_deployer.job_deployer import JobDeployer

SENTRY_DSN = os.environ.get("SENTRY_DSN")
sentry_sdk.init(
    dsn=SENTRY_DSN,
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


@app.post("/deploy-job")
async def deploy_job(
    request: DeployJobRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:

        job = await db.get_job(config=config, user_defined_id=request.user_defined_id)
        job.status = JobStatus.deploying
        await db.upsert_job(job)
        deployer = JobDeployer(db=db, config=config)
        job = await deployer.deploy_job(job=job)
        return job
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-job-upload-link")
async def get_job_upload_link(
    request: DeployJobRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        deployer = JobDeployer(db=db, config=config)
        job = await db.get_job(config=config, user_defined_id=request.user_defined_id)
        if job is None:
            job = Job(
                id=str(uuid.uuid4()),
                app_id=config.app_id,
                user_defined_id=request.user_defined_id,
                name=request.job_name,
                status="deploying",
            )
            await db.upsert_job(job)
        link = await deployer.get_job_upload_link(job=job)
        return {"upload_link": link}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-execution")
async def get_execution(
    request: GetExecutionRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        return {}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0


def start():
    uvicorn.run(
        "server.main:app",
        host="0.0.0.0",
        port=8080,
        reload=True,
        reload_excludes="subprocess_env/**",
    )
