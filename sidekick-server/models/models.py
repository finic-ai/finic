from pydantic import BaseModel
from abc import ABC, abstractmethod
from typing import List, Optional
from enum import Enum


class Source(str, Enum):
    email = "email"
    file = "file"
    chat = "chat"
    documentation="documentation"
    web="web"
    github_issues="github-issues"
    github_markdown="github-markdown"
    discourse="discourse"
    string="string"
    google_drive="google-drive"
    zendesk="zendesk"
    confluence="confluence"

class DocumentMetadata(BaseModel):
    document_id: str
    tenant_id: str
    source_id: Optional[str] = None
    

class DocumentChunkMetadata(DocumentMetadata):
    chunk_id: str

class DocumentChunk(BaseModel):
    title: Optional[str] = ""
    text: str
    url: str
    source_type: Source
    metadata: Optional[DocumentChunkMetadata]

class DocumentChunkWithScore(DocumentChunk):
    score: float

class Document(BaseModel):
    title: str
    text: str
    url: str
    source_type: Source
    metadata: Optional[DocumentMetadata] = None


class DocumentWithChunks(Document):
    chunks: List[DocumentChunk]


class DocumentMetadataFilter(BaseModel):
    source_type: Optional[Source] = None
    tenant_id: Optional[str] = None

class AuthorizationResult(BaseModel):
    auth_url: Optional[str] = None
    authorized: bool = False

class DataConnector(BaseModel, ABC):
    source_type: Source
    connector_id: int

    @abstractmethod
    async def authorize(self, *args, **kwargs) -> AuthorizationResult:
        pass

    @abstractmethod
    async def load(self, *args, **kwargs) -> List[Document]:
        pass

class DataChunker(BaseModel, ABC):
    supported_sources: List[Source]

    @abstractmethod
    def chunk(self, document: Document, *args, **kwargs) -> List[DocumentWithChunks]:
        pass

class Query(BaseModel):
    query: str
    filter: Optional[DocumentMetadataFilter] = None
    top_k: Optional[int] = 3

class QueryWithEmbedding(Query):
    embedding: List[float]

class QueryResult(BaseModel):
    query: str
    results: List[DocumentChunkWithScore]

class Intent(BaseModel):
    name: str
    description: Optional[str] = None

class LLMResult(QueryResult):
    intent: Intent
    can_answer: bool
    answer: str

class EvaluationResult(BaseModel):
    intent: Intent
    content_contains_answer: bool
    justification: str

class AppConfig(BaseModel):
    app_id: str
    tenant_id: str