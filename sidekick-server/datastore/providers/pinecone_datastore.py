import asyncio
from typing import Dict, List, Optional
from loguru import logger
import pinecone
import os
import uuid
import html

from weaviate.util import generate_uuid5

from datastore.datastore import DataStore
from models.models import (
    DocumentChunk,
    DocumentChunkMetadata,
    DocumentMetadataFilter,
    QueryResult,
    QueryWithEmbedding,
    DocumentChunkWithScore,
    Source,
    AppConfig,
)
import openai
from tenacity import retry, wait_random_exponential, stop_after_attempt
import json

class PineconeDataStore(DataStore):

    def __init__(self, credentials: str):

        creds_json = json.loads(credentials)

        index = creds_json['index']
        api_key = creds_json['api_key']
        environment = creds_json['environment']

        pinecone.init(api_key=api_key, environment=environment)
        print("hello1")

        try: 
            indexes = pinecone.list_indexes()
        except Exception as e:
            print(e)
        print(indexes)
        if index in indexes:
            self.index = pinecone.Index(index)

        else:
            # create an index
            print("creating index")
            try:
                print(index)
                pinecone.create_index(
                    index,
                    dimension=1536,
                    metadata_config={
                        "indexed": ["url", "tenant_id", "source_type", "source_id"]
                    }
                )
            except Exception as e:
                print(e)
            print("cannot create index")
            self.index = pinecone.Index(index)

    async def _upsert(self, chunks: List[DocumentChunk]) -> List[str]:
        """
        Upsert a list of chunks into the Pinecone index
        """

        # create a list of tuples with the id and the vector
        # the id is the url of the document
        # the vector is the embedding of the text
        vector_list = []
        embeddings = get_embeddings(chunks)
        for i in range(len(chunks)):
            chunk = chunks[i]
            vector = pinecone.Vector(
                id=chunk.metadata.chunk_id,
                values=embeddings[i],
                metadata={
                    "title": chunk.title,
                    "url": chunk.url,
                    "source_id": chunk.metadata.source_id,
                    "document_id": chunk.metadata.document_id,
                    "text": chunk.text,
                    "tenant_id": chunk.metadata.tenant_id,
                    "source_type": chunk.source_type,
                }
            )
            vector_list.append(vector)  

        # upsert the list of tuples
        self.index.upsert(vector_list, batch_size=100)

        return [chunk.metadata.chunk_id for chunk in chunks]
    
    async def _query(
        self,
        queries: List[QueryWithEmbedding],
        tenant_id: str
    ) -> List[QueryResult]:
        print("querying pinecone")
        async def _single_query(query: QueryWithEmbedding) -> QueryResult:
            query_filter = DocumentMetadataFilter(tenant_id=tenant_id)
            if query.filter and query.filter.source_type:
                query_filter.source_type = query.filter.source_type

            filters_ = self.build_filters(query_filter)
            embeddings = get_embeddings_from_text(query.query)
            query_response = self.index.query(
                vector=embeddings[0],
                top_k=query.top_k,
                filters=filters_,
                include_metadata=True
            )
            query_results: List[DocumentChunkWithScore] = []

            for chunk in query_response.matches:
                query_results.append(
                    DocumentChunkWithScore(
                        title=chunk.metadata["title"],
                        url=chunk.metadata["url"],
                        text=chunk.metadata["text"],
                        source_type=chunk.metadata["source_type"],
                        score=chunk.score,
                        metadata=DocumentChunkMetadata(
                            chunk_id=chunk.id,
                            document_id=chunk.metadata["document_id"],
                            source_id=chunk.metadata["source_id"],
                            tenant_id=chunk.metadata["tenant_id"],
                        ),
                    )
                )
            return QueryResult(query=query.query, results=query_results)
        
        results: List[QueryResult] = await asyncio.gather(
            *[_single_query(query) for query in queries]
        )

        return results
    
    async def delete(
        self,
        ids: Optional[List[str]] = None,
        filter: Optional[DocumentMetadataFilter] = None,
        delete_all: Optional[bool] = None,
    ) -> bool:
        if delete_all:
            self.index.delete(delete_all=True)
            return True

        if ids:
            self.index.delete(ids)
            return True

        if filter:
            filters_ = self.build_filters(filter)
            print(filters_)
            self.index.delete(filter=filters_, delete_all=False)
            return True

        return False

    
    @staticmethod
    def build_filters(filter: DocumentMetadataFilter):
        _filter = {"tenant_id": filter.tenant_id}
        if filter.source_type:
            _filter["source_type"] = filter.source_type.value
        return _filter



# @retry(wait=wait_random_exponential(min=1, max=20), stop=stop_after_attempt(3))
def get_embeddings(chunks: List[DocumentChunk]) -> List[List[float]]:
    texts = [(chunk.title + " " + chunk.text) for chunk in chunks]
    # Call the OpenAI API to get the embeddings
    response = openai.Embedding.create(input=texts, model="text-embedding-ada-002")

    # Extract the embedding data from the response
    data = response["data"]  # type: ignore

    # Return the embeddings as a list of lists of floats
    return [result["embedding"] for result in data]

def get_embeddings_from_text(text: str) -> List[List[float]]:
    # Call the OpenAI API to get the embeddings
    response = openai.Embedding.create(input=text, model="text-embedding-ada-002")

    # Extract the embedding data from the response
    data = response["data"]  # type: ignore

    # Return the embeddings as a list of lists of floats
    return [result["embedding"] for result in data]