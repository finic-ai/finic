from models.models import (
    Document,
    DocumentChunkWithScore,
    DocumentMetadataFilter,
    Query,
    QueryResult,
    LLMResult,
    Intent
)
from pydantic import BaseModel
from typing import List, Optional

class UpsertRequest(BaseModel):
    documents: List[Document]

class UpsertFromConnectorRequest(BaseModel):
    connector_id: int
    path: Optional[str]

class UpsertWebDataRequest(BaseModel):
    url: str

class UpsertGoogleDocsRequest(BaseModel):
    folder_name: str

class AuthorizeGoogleDriveRequest(BaseModel):
    redirect_uri: str
    auth_code: Optional[str]

class AuthorizeWithApiKeyRequest(BaseModel):
    api_key: str
    connector_id: int
    subdomain: Optional[str] = None
    email: Optional[str] = None
    

class AuthorizeResponse(BaseModel):
    authorized: bool

class AuthorizeGoogleDriveResponse(AuthorizeResponse):
    auth_url: Optional[str]

class AskLLMRequest(BaseModel):
    queries: List[Query]
    possible_intents: List[Intent]

class UpsertResponse(BaseModel):
    ids: List[str]


class QueryRequest(BaseModel):
    queries: List[Query]


class QueryResponse(BaseModel):
    results: List[QueryResult]

class LLMResponse(BaseModel):
    results: List[LLMResult]

class DeleteRequest(BaseModel):
    ids: Optional[List[str]] = None
    filter: Optional[DocumentMetadataFilter] = None
    delete_all: Optional[bool] = False

class DeleteResponse(BaseModel):
    success: bool
