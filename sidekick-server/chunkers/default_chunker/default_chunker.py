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
import tiktoken


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

    def chunk_tokens(self, source_id: str, document: Document, token_limit: int = 1000) -> List[DocumentChunk]:
        tokenizer = tiktoken.get_encoding(
            "cl100k_base"
        )

        text = document.text
        chunks = []
        tokens = tokenizer.encode(text, disallowed_special=())

        while tokens:
            chunk = tokens[:token_limit]
            chunk_text = tokenizer.decode(chunk)
            last_punctuation = max(
                chunk_text.rfind("."),
                chunk_text.rfind("?"),
                chunk_text.rfind("!"),
                chunk_text.rfind("\n"),
            )
            if last_punctuation != -1:
                chunk_text = chunk_text[: last_punctuation + 1]
            cleaned_text = chunk_text.replace("\n", " ").strip()

            if cleaned_text and (not cleaned_text.isspace()):
                chunk = DocumentChunk(
                    title=document.title,
                    text=cleaned_text,
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

            tokens = tokens[len(tokenizer.encode(chunk_text, disallowed_special=())):]

        return chunks


        
