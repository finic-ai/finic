from pydantic import BaseModel
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

class DocumentMetadata(BaseModel):
    source: Optional[Source] = None
    source_id: Optional[str] = None
    url: Optional[str] = None
    created_at: Optional[str] = None
    author: Optional[str] = None


class DocumentChunkMetadata(DocumentMetadata):
    document_id: Optional[str] = None

class DocumentChunk(BaseModel):
    id: Optional[str] = None
    content: str
    raw_markdown: Optional[str] = None
    title: Optional[str] = None
    h2: Optional[str] = None
    h3: Optional[str] = None
    h4: Optional[str] = None
    product: str
    source_type: Source
    url: Optional[str] = None

class DocumentChunkWithScore(DocumentChunk):
    score: float


class Document(BaseModel):
    id: Optional[str] = None
    text: str
    metadata: Optional[DocumentMetadata] = None


class DocumentWithChunks(Document):
    chunks: List[DocumentChunk]


class DocumentMetadataFilter(BaseModel):
    source_type: Optional[Source] = None
    product: Optional[str] = None

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
    product_id: str