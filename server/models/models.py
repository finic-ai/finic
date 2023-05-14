from pydantic import BaseModel
from abc import ABC, abstractmethod
from typing import List, Optional, Dict
from enum import Enum


class ConnectorId(str, Enum):
    notion = "notion"
    gdrive = "gdrive"
    zendesk = "zendesk"
    confluence = "confluence"

class Connection(BaseModel):
    connection_id: str
    metadata: Dict
    credential: Optional[str]
    
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
    async def load(self, *args, **kwargs) -> List[Document]:
        pass


class AppConfig(BaseModel):
    app_id: str
    user_id: str
