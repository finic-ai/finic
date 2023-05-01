from models.models import (
    Connection,
    ConnectorId,
    ConnectorStatus
)
from pydantic import BaseModel
from typing import List, Optional, Dict

class ConnectorStatusResponse(BaseModel):
    status: ConnectorStatus

class ConnectorStatusRequest(BaseModel):
    connector_id: ConnectorId


class EnableConnectorRequest(BaseModel):
    connector_id: ConnectorId
    credential: Dict

class AuthorizeOauthRequest(BaseModel):
    redirect_uri: str
    auth_code: Optional[str]
    connector_id: int


class AuthorizeResponse(BaseModel):
    authorized: bool


class OauthResponse(AuthorizeResponse):
    auth_url: Optional[str]


