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
    OauthResponse,
    AuthorizeOauthRequest,
    EnableConnectorRequest,
    ConnectorStatusRequest,
    ConnectorStatusResponse,
)


from appstatestore.statestore import StateStore
from models.models import (
    AppConfig,
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
    print('config', app_config)
    if credentials.scheme != "Bearer" or app_config is None:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    return app_config

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
    "/authorize-oauth",
    response_model=OauthResponse,
)
async def authorize_oauth(
    request: AuthorizeOauthRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    auth_code = request.auth_code
    redirect_uri = request.redirect_uri
    connector_id = request.connector_id

    connector = get_connector_for_id(connector_id, config)

    print("connector", connector)

    if connector is None:
        raise HTTPException(status_code=404, detail="Connector not found")

    auth_url = await connector.authorize(redirect_uri, auth_code)
    return OauthResponse(auth_url=auth_url, authorized=auth_url is None)



# @app.on_event("startup")
# async def startup():
#     global datastore
#     datastore = get_datastore()
    


def start():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8080, reload=True)
