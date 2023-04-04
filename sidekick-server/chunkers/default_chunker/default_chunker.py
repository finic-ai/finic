from models.models import (
    DataChunker,
    Document,
    DocumentChunk,
    DocumentChunkMetadata,
    Source
)
from typing import List, Optional
from langchain import text_splitter
import uuid


class DefaultChunker(DataChunker):
    supported_sources: List[Source] = [Source.web]

    def chunk(self, source_id: str, document: Document, token_limit: int = 1000) -> List[DocumentChunk]:
        text = document.text

        splitter = text_splitter.CharacterTextSplitter(separator=" ", chunk_size=1000, chunk_overlap=0)

        chunk_texts = splitter.split_text(text)

        chunks = []

        for chunk_text in chunk_texts:
            chunk = DocumentChunk(
                title=document.title,
                text=chunk_text,
                url=document.url,
                source_type=document.source_type,
                metadata=DocumentChunkMetadata(
                    document_id=document.metadata.document_id,
                    source_id=document.metadata.source_id,
                    tenant_id=document.metadata.tenant_id,
                    chunk_id=str(uuid.uuid4())
                )
            )
            chunks.append(chunk)
        return chunks

        
