import os
import uvicorn
import uuid
import pdb
from fastapi import FastAPI, File, HTTPException, Depends, Body, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import urlparse

from models.api import (
    AuthorizationResponse,
    AuthorizeOauthRequest,
    EnableConnectorRequest,
    ConnectorStatusRequest,
    ConnectorStatusResponse,
    GetDocumentsRequest,
    GetDocumentsResponse,
)

from llm.LLM import LLM
from connectors.google_docs_connector import GoogleDocsConnector
from connectors.web_connector import WebConnector
from connectors.website_connector import WebsiteConnector
from chunkers.html_chunker import HTMLChunker
from chunkers.default_chunker import DefaultChunker

from appstatestore.statestore import StateStore
from models.models import (
    Source,
    AppConfig,
    DocumentChunk,
    DataConnector,
    DocumentMetadata
)
from connectors.connector_utils import get_connector_for_id
import uuid
from logger import Logger

from datastore.factory import get_datastore, update_vectorstore


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the list of allowed origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/.well-known", StaticFiles(directory=".well-known"), name="static")

# Create a sub-application, in order to access just the query endpoint in an OpenAPI schema, found at http://0.0.0.0:8000/sub/openapi.json when the app is running locally
sub_app = FastAPI(
    title="Retrieval Plugin API",
    description="A retrieval API for querying and filtering documents based on natural language queries and metadata",
    version="1.0.0",
    servers=[{"url": "https://your-app-url.com"}],
)
app.mount("/sub", sub_app)

bearer_scheme = HTTPBearer()
BEARER_TOKEN = os.environ.get("BEARER_TOKEN")
assert BEARER_TOKEN is not None


def validate_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    app_config = StateStore().get_config(credentials.credentials)
    if credentials.scheme != "Bearer" or app_config is None:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    return app_config

def validate_public_key(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    app_config = StateStore().get_config_from_public_key(credentials.credentials)
    if credentials.scheme != "Bearer" or app_config is None:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    return app_config


@app.post(
    "/select-vectorstore",
    response_model=SelectVectorstoreResponse,
)
async def select_vectorstore(
    request: SelectVectorstoreRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        
        update_vectorstore(config, request.vectorstore, request.credentials)
        
        return SelectVectorstoreResponse(success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")

@app.post(
    "/authorize-with-api-key",
    response_model=AuthorizeResponse,
)
async def authorize_with_api_key(
    request: AuthorizeWithApiKeyRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        api_key = request.api_key
        connector_id = request.connector_id
        subdomain = request.subdomain
        email = request.email

        connector = get_connector_for_id(connector_id, config)

        if connector is None:
            raise HTTPException(status_code=404, detail="Connector not found")
        
        auth_result = await connector.authorize(api_key, subdomain, email)
        
        return AuthorizeResponse(authorized=auth_result.authorized)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")


@app.post(
    "/enable-connector",
    response_model=ConnectorStatusResponse,
)
async def enable_connector(
    request: EnableConnectorRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    connector_id = request.connector_id
    credential = request.credential
    status = StateStore().enable_connector(connector_id, credential, config)
    return ConnectorStatusResponse(status=status)

@app.post(
    "/get-connector-status",
    response_model=ConnectorStatusResponse,
)
async def get_connector_status(
    request: ConnectorStatusRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    connector_id = request.connector_id
    status = StateStore().get_connector_status(connector_id, config)
    return ConnectorStatusResponse(status=status)


@app.post(
    "/add-oauth-connection",
    response_model=AuthorizationResponse,
)
async def add_oauth_connection(
    request: AuthorizeOauthRequest = Body(...),
    config: AppConfig = Depends(validate_public_key),
):
    auth_code = request.auth_code or None
    connector_id = request.connector_id
    connection_id = request.connection_id

    connector = get_connector_for_id(connector_id, config)

    print("connector", connector)

    if connector is None:
        raise HTTPException(status_code=404, detail="Connector not found")

    result = await connector.authorize(connection_id, auth_code)
    return AuthorizationResponse(result=result)
    
@app.post(
    "/get-documents",
    response_model=GetDocumentsResponse,
)
async def get_documents(
    request: GetDocumentsRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    connector_id = request.connector_id
    connection_id = request.connection_id

    connector = get_connector_for_id(connector_id, config)

    print("connector", connector)

    if connector is None:
        raise HTTPException(status_code=404, detail="Connector not found")

    result = await connector.load(connection_id)
    return GetDocumentsResponse(documents=result)



@sub_app.post(
    "/query",
    response_model=QueryResponse,
    # NOTE: We are describing the the shape of the API endpoint input due to a current limitation in parsing arrays of objects from OpenAPI schemas. This will not be necessary in future.
    description="Accepts search query objects array each with query and optional filter. Break down complex questions into sub-questions. Refine results by criteria, e.g. time / source, don't do this often. Split queries if ResponseTooLargeError occurs.",
)
async def query(
    request: QueryRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    datastore = get_datastore(config=config)
    try:
        results = await datastore.query(
            request.queries,
            tenant_id=config.tenant_id,
        )
        return QueryResponse(results=results)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Internal Service Error")


# @app.on_event("startup")
# async def startup():
#     global datastore
#     datastore = get_datastore()
    


def start():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8080, reload=True)
