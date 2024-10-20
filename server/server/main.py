import os
import uvicorn
from fastapi import (
    FastAPI,
    HTTPException,
    Depends,
    Body,
    Request,
    Path,
    status,
    Form,
    Query,
    BackgroundTasks,
)
from fastapi.exceptions import RequestValidationError

from fastapi.responses import JSONResponse

from typing import List, Optional, Dict
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
import uuid
from models.models import AppConfig, Session, Browser, Agent, SessionStatus, DOMNodeDetails
from models.api import RunAgentRequest, AgentUploadRequest, UpdateSessionRequest, CopilotRequest
from database import Database
from copilot import generate_code
import io
import datetime
import pdb
import logging
import sentry_sdk
import json
from worker_client import WorkerClient

anthropic_api_key = os.environ.get("ANTHROPIC_API_KEY")

SENTRY_DSN = os.environ.get("SENTRY_DSN")
if SENTRY_DSN:
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
        print(credentials.credentials)
        app_config = db.get_config(credentials.credentials)
    except Exception:
        print(credentials.credentials)
        raise HTTPException(status_code=401, detail="Invalid or missing private key")
    if credentials.scheme != "Bearer" or app_config is None:
        print(credentials.credentials)
        raise HTTPException(status_code=401, detail="Invalid or missing private key")
    return app_config


@app.get("/browser-state/{browser_id}")
async def get_browser_state(
    browser_id: str = Path(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        browser = db.get_browser(config, browser_id)
        return browser
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/browser-state/{browser_id}")
async def upsert_browser_state(
    browser_id: str = Path(...),
    config: AppConfig = Depends(validate_token),
    browser_state: Dict = Body(...),
):
    try:
        browser = Browser(
            id=browser_id,
            app_id=config.app_id,
            state=browser_state
        )
        browser = db.upsert_browser(browser)
        return browser 
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/session/{session_id}")
async def get_session(
    session_id: str = Path(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        session = db.get_session(session_id, config.app_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return session
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/session/{session_id}")
async def update_session(
    session_id: str = Path(...),
    config: AppConfig = Depends(validate_token),
    request: UpdateSessionRequest = Body(...),
):
    try:
        session = db.get_session(session_id, config.app_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        if request.status:
            session.status = request.status
        if request.results:
            session.results = request.results
        if request.error:
            session.error = request.error
        if request.logs:
            session.logs += request.logs
        session = db.upsert_session(session)
        return session
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run-agent/{agent_id}")
async def run_agent(
    background_tasks: BackgroundTasks,
    agent_id: str = Path(...),
    request: RunAgentRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        session_id = str(uuid.uuid4())
        
        secret_key = db.get_secret_key_for_user(config.user_id)
        worker_client = WorkerClient( secret_key, background_tasks )
        cloud_execution_id = worker_client.run_worker(
            session_id=session_id,
            browser_id=request.browser_id,
            agent_id=agent_id,
            agent_input=request.agent_input,
        )
        session = Session(
            id=session_id, 
            app_id=config.app_id, 
            browser_id=request.browser_id,
            agent_id=agent_id,
            status=SessionStatus.RUNNING,
            created_at=datetime.datetime.now(),
            cloud_execution_id=cloud_execution_id
        )
        session = db.upsert_session(session)
        return {"session_id": session_id}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    

    
@app.post("/agent-upload-link/{agent_id}")
async def get_agent_upload_link(
    agent_id: str = Path(...),
    request: AgentUploadRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        agent = Agent(
            id=agent_id,
            app_id=config.app_id,
            name=request.agent_name,
            num_retries=request.num_retries
        )
        db.upsert_agent(agent)
        upload_url = db.get_agent_upload_link(agent)
        return {"upload_url": upload_url}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/agent-download-link/{agent_id}")
async def get_agent_download_link(
    agent_id: str = Path(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        agent = db.get_agent(agent_id, config.app_id)
        url = db.get_agent_download_link(agent)
        return {"download_url": url}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/session-recording-upload-link/{session_id}")
async def get_session_recording_upload_link(
    session_id: str = Path(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        session = db.get_session(session_id, config.app_id)
        upload_url = db.get_session_recording_upload_link(session)
        return {"upload_url": upload_url} 
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/copilot")
async def get_session_recording_upload_link(
    request: CopilotRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        element = DOMNodeDetails(**request.element)
        result = await generate_code(request.intent, element, request.existing_code, provider="anthropic", provider_api_key=anthropic_api_key)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/session-recording-download-link/{session_id}")
async def get_session_recording_download_link(
    session_id: str = Path(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        session = db.get_session(session_id, config.app_id)
        download_url = db.get_session_recording_download_link(session)
        return {"download_url": download_url}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/agent/{agent_id}")
async def get_agent(
    agent_id: str = Path(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        agent = db.get_agent(agent_id, config.app_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        return agent
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/agent/{agent_id}/list-sessions")
async def list_agent_sessions(
    agent_id: str = Path(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        sessions = db.list_sessions(agent_id, config.app_id)
        return sessions
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/list-agents")
async def list_agents(
    config: AppConfig = Depends(validate_token),
):
    try:
        agents = db.list_agents(config.app_id)
        print(agents)
        return agents
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/trace-upload-link")
async def get_trace_upload_link(
    config: AppConfig = Depends(validate_token),
):
    try:
        upload_url = db.get_trace_upload_link(app_id=config.app_id)
        return {"upload_url": upload_url}
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
