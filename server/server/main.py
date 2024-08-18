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
from models.models import AppConfig, Workflow, WorkflowRunStatus
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
from models.api import (
    GetWorkflowRequest,
    UpsertWorkflowRequest,
    ListWorkflowsRequest,
    DeleteWorkflowRequest,
    UpdateNodeConfigurationRequest,
    CheckCredentialsRequest,
    GetTransformationRequest,
    UpsertTransformationRequest,
)
import uuid
from models.models import AppConfig, Node, NodeType, Credential, Transformation
from database import Database
import io
import datetime
import pdb
import logging
import sentry_sdk
from workflow_job_runner import WorkflowJobRunner
import json

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


@app.post("/check-credentials")
async def check_credentials(
    request: CheckCredentialsRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        credentials = await db.get_credentials(request.workflow_id, config.app_id)
        if credentials:
            return {"has_credentials": True}
        return {"has_credentials": False}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/update-node-config")
async def update_node_config(
    request: UpdateNodeConfigurationRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        workflow = await db.get_workflow(request.workflow_id, config.app_id)
        for node in workflow.nodes:
            if node.id == request.node_id:
                if "credentials" in request.configuration:
                    if type(request.configuration["credentials"]) == str:
                        request.configuration["credentials"] = json.loads(
                            request.configuration["credentials"]
                        )
                    old_credentials = await db.get_credentials(
                        request.workflow_id, request.node_id, config.user_id
                    )
                    new_credentials = Credential(
                        id=(
                            old_credentials["id"]
                            if old_credentials
                            else str(uuid.uuid4())
                        ),
                        workflow_id=request.workflow_id,
                        node_id=request.node_id,
                        app_id=config.app_id,
                        user_id=config.user_id,
                        credentials=request.configuration["credentials"],
                    )
                    await db.upsert_credentials(new_credentials)
                    config = request.configuration
                    config.pop("credentials")
                    config["has_credentials"] = True
                    node.data.configuration = config
                else:
                    node.data.configuration = request.configuration
        new_workflow = await db.upsert_workflow(workflow=workflow)
        if not new_credentials or not new_workflow:
            raise HTTPException(
                status_code=500, detail="Failed to update node configuration"
            )
        return new_workflow
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upsert-workflow")
async def upsert_workflow(
    request: UpsertWorkflowRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        workflow = Workflow(
            id=str(uuid.uuid4()),
            app_id=config.app_id,
            name=request.name if request.name else "New Workflow",
            status=request.status if request.status else "draft",
            nodes=request.nodes if request.nodes else [],
            edges=request.edges if request.edges else [],
        )
        if request.id:
            print(request.id)
            existing_workflow = await db.get_workflow(request.id, config.app_id)
            if existing_workflow:
                workflow = existing_workflow
        for key, value in request.dict().items():
            if value:
                setattr(workflow, key, value)
        await db.upsert_workflow(workflow=workflow)
        return workflow
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-transformation")
async def get_transformation(
    request: GetTransformationRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        # pdb.set_trace()
        transformation = await db.get_transformation(
            request.workflow_id, request.node_id
        )
        return transformation
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upsert-transformation")
async def upsert_transformation(
    request: UpsertTransformationRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        transformation = Transformation(
            workflow_id=request.workflow_id,
            node_id=request.node_id,
            code=request.code,
            app_id=config.app_id,
        )
        transformation = await db.upsert_transformation(transformation)
        return transformation
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/delete-workflow")
async def delete_workflow(
    request: DeleteWorkflowRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        workflow = await db.delete_workflow(request.id, config.app_id)
        return workflow
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-workflow")
async def get_workflow(
    request: GetWorkflowRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        workflow = await db.get_workflow(request.id, config.app_id)
        return workflow
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/list-workflows")
async def list_workflows(
    request: ListWorkflowsRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        workflows = await db.list_workflows(config.app_id)
        return workflows
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/run-workflow")
async def run_workflow(
    request: GetWorkflowRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        workflow_id = request.id
        runner = WorkflowJobRunner(db=db, config=config)
        latest_run = await runner.get_run_status(workflow_id)
        if latest_run and latest_run.status == WorkflowRunStatus.running:
            raise HTTPException(status_code=400, detail="Workflow is already running")
        run = await runner.start_job(workflow_id)
        return run
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-workflow-run")
async def get_workflow_run(
    request: GetWorkflowRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        workflow_id = request.id
        runner = WorkflowJobRunner(db=db, config=config)
        run = await runner.get_run_status(workflow_id)
        return run
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
