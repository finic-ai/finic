from models.models import (
    Document,
    ConnectorId,
    ConnectorStatus,
    AuthorizationResult,
    Connection,
    ConnectionFilter,
    Message,
    Settings,
    SectionFilter,
    GetDocumentsResponse,
)
from pydantic import BaseModel
from typing import List, Optional, Dict, TypeVar, Union


class GetLinkSettingsResponse(BaseModel):
    settings: Optional[Settings]


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
    custom_config: Optional[Dict]
    credential: Optional[Dict]


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
    connector_id: Optional[ConnectorId]
    section_filter: Optional[str]
    uris: Optional[List[str]]
    account_id: str
    chunked: Optional[bool] = False
    min_chunk_size: Optional[int] = 500
    max_chunk_size: Optional[int] = 1500
    page_cursor: Optional[str] = None
    page_size: Optional[int] = 100


class GetTicketsRequest(BaseModel):
    connector_id: Optional[ConnectorId]
    account_id: str
    redact_pii: Optional[bool] = False
    page_cursor: Optional[str] = None
    page_size: Optional[int] = 100


class GetTicketsResponse(BaseModel):
    tickets: List[Document]
    next_page_cursor: Optional[str] = None


class GetConversationsRequest(BaseModel):
    connector_id: ConnectorId
    account_id: str
    oldest_message_timestamp: Optional[str] = None
    page_cursor: Optional[str] = None


class GetConversationsResponse(BaseModel):
    messages: List[Message]
    page_cursor: Optional[str]


class RunSyncRequest(BaseModel):
    sync_all: bool


class RunSyncResponse(BaseModel):
    success: List[bool]


class AskQuestionRequest(BaseModel):
    question: str
    connector_ids: Optional[List[ConnectorId]]
    account_id: str
    openai_api_key: str


class AskQuestionResponse(BaseModel):
    answer: str
    sources: List[str]


class AddSectionFilterRequest(BaseModel):
    connector_id: ConnectorId
    account_id: str
    section_filter: SectionFilter


class AddSectionFilterResponse(BaseModel):
    success: bool
    section_filter: Optional[SectionFilter]


class UpdateConnectionMetadataResponse(BaseModel):
    success: bool


class UpdateConnectionMetadataRequest(BaseModel):
    connector_id: ConnectorId
    account_id: str
    metadata: Dict


class DeleteConnectionRequest(BaseModel):
    connector_id: ConnectorId
    account_id: str


class DeleteConnectionResponse(BaseModel):
    success: bool
