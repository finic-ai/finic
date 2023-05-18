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
    AuthorizeApiKeyRequest,
    GetConnectionsRequest,
    GetConnectionsResponse,
)

from appstatestore.statestore import StateStore
from models.models import (
    AppConfig,
    DataConnector,
)
from connectors.connector_utils import get_connector_for_id
import uuid
from logger import Logger



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the list of allowed origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer_scheme = HTTPBearer()



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
    "/set-custom-connector-credentials",
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
    "/get-connections",
    response_model=GetConnectionsResponse,
)
async def get_connections(
    request: GetConnectionsRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    filter = request.filter
    connections = StateStore().get_connections(filter, config)
    return GetConnectionsResponse(connections=connections)

@app.post(
    "/add-apikey-connection",
    response_model=AuthorizationResponse,
)
async def add_apikey_connection(
    request: AuthorizeApiKeyRequest = Body(...),
    config: AppConfig = Depends(validate_public_key),
):
    connector_id = request.connector_id
    connection_id = request.connection_id
    credential = request.credential
    metadata = request.metadata

    connector = get_connector_for_id(connector_id, config)

    print("connector", connector)

    if connector is None:
        raise HTTPException(status_code=404, detail="Connector not found")
    result = await connector.authorize_api_key(connection_id, credential, metadata)
    return AuthorizationResponse(result=result)


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
    metadata = request.metadata

    connector = get_connector_for_id(connector_id, config)

    print("connector", connector)

    if connector is None:
        raise HTTPException(status_code=404, detail="Connector not found")

    result = await connector.authorize(connection_id, auth_code, metadata)
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


# @app.on_event("startup")
# async def startup():
#     global datastore
#     datastore = get_datastore()
    


def start():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8080, reload=True)
