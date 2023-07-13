from pydantic import BaseModel
from abc import ABC, abstractmethod
from typing import List, Optional, Dict
from enum import Enum
from strenum import StrEnum


class ConnectorId(StrEnum):
    clickup = "clickup"
    confluence = "confluence"
    dropbox = "dropbox"
    gdrive = "gdrive"
    github = "github"
    gmail = "gmail"
    hubspot = "hubspot"
    intercom = "intercom"
    notion = "notion"
    readme = "readme"
    salesforce = "salesforce"
    slack = "slack"
    web = "web"
    zendesk = "zendesk"
    sharepoint = "sharepoint"


class Settings(BaseModel):
    name: str
    logo: Optional[str]
    whitelabel: bool
    custom_auth_url: Optional[str]
    enabled_connectors: Optional[List[ConnectorId]] = []
    connector_configs: Optional[Dict] = {}


class AppConfig(BaseModel):
    app_id: str
    user_id: str


class SectionType(str, Enum):
    folder = "folder"
    document = "document"


class Section(BaseModel):
    id: str
    name: str
    type: SectionType
    children: Optional[List["Section"]] = None


Section.update_forward_refs()


class SectionFilter(BaseModel):
    id: str
    sections: List[Section]


class Connection(BaseModel):
    account_id: str
    connector_id: ConnectorId
    metadata: Dict
    section_filters: Optional[List[SectionFilter]] = []
    sections: Optional[List[Section]] = None
    credential: Optional[str]
    new_credential: Optional[str] = None
    config: Optional[AppConfig]


class ConnectorStatus(BaseModel):
    is_enabled: bool
    custom_credentials: Optional[Dict]
    custom_config: Optional[Dict]
    connections: List[Connection] = []
    redirect_uris: Optional[List[str]] = []


class MessageSender(BaseModel):
    id: str
    name: Optional[str]


class MessageRecipient(BaseModel):
    id: str
    name: Optional[str]


class Message(BaseModel):
    content: str
    id: Optional[str] = None
    uri: Optional[str] = None


class AuthorizationResult(BaseModel):
    auth_url: Optional[str] = None
    authorized: bool = False
    connection: Optional[Connection] = None


class Document(BaseModel):
    title: str
    content: str
    connector_id: ConnectorId
    account_id: str
    uri: Optional[str] = None


class GetDocumentsResponse(BaseModel):
    documents: List[Document]
    next_page_cursor: Optional[str] = None


class GetConversationsResponse(BaseModel):
    messages: List[Message]
    page_cursor: Optional[str]


class GetTicketsResponse(BaseModel):
    tickets: List[Document]
    next_page_cursor: Optional[str] = None


class ConnectionFilter(BaseModel):
    connector_id: Optional[ConnectorId] = None
    account_id: str
    uris: Optional[List[str]] = None
    section_filter_id: Optional[str] = None
    page_cursor: Optional[str] = None
    page_size: Optional[int] = 100


class DataConnector(BaseModel, ABC):
    connector_id: ConnectorId

    @abstractmethod
    async def authorize(self, *args, **kwargs) -> AuthorizationResult:
        pass

    @abstractmethod
    async def authorize_api_key(self, *args, **kwargs) -> AuthorizationResult:
        pass

    @abstractmethod
    async def get_sections(self, *args, **kwargs) -> List[Section]:
        pass


class DocumentConnector(DataConnector):
    @abstractmethod
    async def load(self, connection_filter: ConnectionFilter) -> GetDocumentsResponse:
        pass


class ConversationConnector(DataConnector):
    @abstractmethod
    async def load_messages(
        self,
        account_id: str,
        oldest_message_timestamp: Optional[str],
        page_cursor: Optional[str],
        page_size: Optional[int],
    ) -> GetConversationsResponse:
        pass


class TicketConnector(DataConnector):
    @abstractmethod
    async def load_tickets(
        self, connection_filter: ConnectionFilter, redact_pii: bool = False
    ) -> GetTicketsResponse:
        pass


class Sync(BaseModel):
    app_id: str
    webhook_url: str


class SyncResult(BaseModel):
    account_id: str
    connector_id: str
    success: bool
    docs_synced: int
    error: str = ""


class SyncResults(BaseModel):
    last_updated: int
    results: List[SyncResult] = []


class AskQuestionResult(BaseModel):
    answer: str
    sources: List[str]
