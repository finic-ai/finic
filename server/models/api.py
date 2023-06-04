from models.models import (
    Document,
    Message,
    ConnectorId,
    ConnectorStatus,
    AuthorizationResult,
    Connection,
    ConnectionFilter
)
from pydantic import BaseModel
from typing import List, Optional, Dict

class ConnectorStatusResponse(BaseModel):
    status: ConnectorStatus

class ConnectorStatusRequest(BaseModel):
    connector_id: ConnectorId

class GetConnectionsRequest(BaseModel):
    filter: ConnectionFilter

class GetConnectionsResponse(BaseModel):
    connections: List[Connection]

class EnableConnectorRequest(BaseModel):
    connector_id: ConnectorId
    credential: Dict

class AuthorizeOauthRequest(BaseModel):
    connector_id: ConnectorId
    account_id: str
    auth_code: Optional[str]
    metadata: Optional[Dict]

class AuthorizeApiKeyRequest(BaseModel):
    connector_id: ConnectorId
    account_id: str
    credential: Dict
    metadata: Optional[Dict]


class AuthorizationResponse(BaseModel):
    result: AuthorizationResult

class GetDocumentsRequest(BaseModel):
    connector_id: ConnectorId
    account_id: str
    pre_chunked: Optional[bool] = False
    min_chunk_size: Optional[int] = 500
    max_chunk_size: Optional[int] = 1500


class GetDocumentsResponse(BaseModel):
    documents: List[Document]

class GetConversationsRequest(BaseModel):
    connector_id: ConnectorId
    account_id: str
    oldest_timestamp: Optional[str] = None

class GetConversationsResponse(BaseModel):
    messages: List[Message]

class RunSyncRequest(BaseModel):
    sync_all: bool

class RunSyncResponse(BaseModel):
    success: List[bool]

class AskQuestionRequest(BaseModel):
    question: str
    connector_ids: List[ConnectorId]
    account_id: str
    openai_api_key: str

class AskQuestionResponse(BaseModel):
    answer: str
    sources: List[str]
