from pydantic import BaseModel
from abc import ABC, abstractmethod
from typing import List, Optional, Dict
from enum import Enum



class ConnectorId(str, Enum):
    notion = "notion"
    gdrive = "gdrive"
    zendesk = "zendesk"
    confluence = "confluence"

class AppConfig(BaseModel):
    app_id: str
    user_id: str

class Connection(BaseModel):
    connection_id: str
    connector_id: ConnectorId
    metadata: Dict
    credential: Optional[str]
    config: Optional[AppConfig]
    
class ConnectorStatus(BaseModel):
    is_enabled: bool
    connections: List[Connection] = []

class Document(BaseModel):
    title: str
    content: str
    uri: Optional[str] = None

class AuthorizationResult(BaseModel):
    auth_url: Optional[str] = None
    authorized: bool = False
    connection: Optional[Connection] = None

class DataConnector(BaseModel, ABC):
    connector_id: ConnectorId

    @abstractmethod
    async def authorize(self, *args, **kwargs) -> AuthorizationResult:
        pass

    @abstractmethod
    async def authorize_api_key(self, *args, **kwargs) -> AuthorizationResult:
        pass

    @abstractmethod
    async def load(self, connection_id: str) -> List[Document]:
        pass



class ConnectionFilter(BaseModel):
    connector_id: Optional[ConnectorId] = None
    connection_id: Optional[str] = None

class Sync(BaseModel):
    app_id: str
    webhook_url: str

class SyncResult(BaseModel):
    connection_id: str
    connector_id: str
    success: bool
    docs_synced: int
    error: str = ""

class SyncResults(BaseModel):
    last_updated: int
    results: List[SyncResult] = []
