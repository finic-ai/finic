import asyncio
from typing import Dict, List, Optional
from loguru import logger
from weaviate import Client
import weaviate
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


WEAVIATE_HOST = os.environ.get("WEAVIATE_HOST", "http://127.0.0.1")
WEAVIATE_PORT = os.environ.get("WEAVIATE_PORT", "8080")
WEAVIATE_USERNAME = os.environ.get("WEAVIATE_USERNAME", None)
WEAVIATE_PASSWORD = os.environ.get("WEAVIATE_PASSWORD", None)
WEAVIATE_SCOPES = os.environ.get("WEAVIATE_SCOPE", None)
WEAVIATE_INDEX = os.environ.get("WEAVIATE_INDEX", "SidekickDocumentChunk")

WEAVIATE_BATCH_SIZE = int(os.environ.get("WEAVIATE_BATCH_SIZE", 20))
WEAVIATE_BATCH_DYNAMIC = os.environ.get("WEAVIATE_BATCH_DYNAMIC", False)
WEAVIATE_BATCH_TIMEOUT_RETRIES = int(os.environ.get("WEAVIATE_TIMEOUT_RETRIES", 3))
WEAVIATE_BATCH_NUM_WORKERS = int(os.environ.get("WEAVIATE_BATCH_NUM_WORKERS", 1))

SCHEMA = {
    "class": WEAVIATE_INDEX,
    "vectorizer": "text2vec-openai",
    "properties": [
        {
            "name": "title",
            "description": "The title of the document.",
            "dataType": ["string"],

        },
        {
            "name": "url",
            "description": "The url to the document.",
            "dataType": ["string"],
            "moduleConfig": {
                "text2vec-openai": {
                "vectorizePropertyName": False
                }
            }

        },
        {
            "name": "source_type",
            "description": "The type of source, either web, github issues, etc.",
            "dataType": ["string"],
            "moduleConfig": {
                "text2vec-openai": {
                    "vectorizePropertyName": False
                }
            }
        },
        {
            "name": "source_id",
            "description": "The unique ID of the data source this chunk is from.",
            "dataType": ["string"],
            "moduleConfig": {
                "text2vec-openai": {
                "vectorizePropertyName": False
                }
            }
        },
        {
            "name": "document_id",
            "description": "The unique ID of the document this chunk is from.",
            "dataType": ["string"],
            "moduleConfig": {
                "text2vec-openai": {
                "vectorizePropertyName": False
                }
            }
        },
        {
            "name": "tenant_id",
            "description": "The unique ID of the client who this chunk belongs to.",
            "dataType": ["string"],
            "moduleConfig": {
                "text2vec-openai": {
                "vectorizePropertyName": False
                }
            }
        },
        {
            "name": "text",
            "description": "the text content in this block",
            "dataType": ["string"],
        },
    ],
    "moduleConfig": {
        "text2vec-openai": {
            "model": "ada",
            "modelVersion": "002",
            "type": "text"
        }
    }
}

def extract_schema_properties(schema):
    properties = schema["properties"]

    return {property["name"] for property in properties}


class WeaviateDataStore(DataStore):

    def __init__(self):
        auth_credentials = self._build_auth_credentials()

        url = f"{WEAVIATE_HOST}:{WEAVIATE_PORT}"

        logger.debug(
            f"Connecting to weaviate instance at {url} with credential type {type(auth_credentials).__name__}"
        )
        self.client = Client(
            url, 
            auth_client_secret=auth_credentials,
            additional_headers = {
                "X-OpenAI-Api-Key": os.environ.get("OPENAI_API_KEY")  # Replace with your API key
            }
        )

        if self.client.schema.contains(SCHEMA):
            current_schema = self.client.schema.get(WEAVIATE_INDEX)
            current_schema_properties = extract_schema_properties(current_schema)

            logger.debug(
                f"Found index {WEAVIATE_INDEX} with properties {current_schema_properties}"
            )
            logger.debug("Will reuse this schema")
        else:
            new_schema_properties = extract_schema_properties(SCHEMA)
            logger.debug(
                f"Creating index {WEAVIATE_INDEX} with properties {new_schema_properties}"
            )
            self.client.schema.create_class(SCHEMA)

    @staticmethod
    def _build_auth_credentials():
        if WEAVIATE_USERNAME and WEAVIATE_PASSWORD:
            return weaviate.auth.AuthClientPassword(
                WEAVIATE_USERNAME, WEAVIATE_PASSWORD
            )
        else:
            return None

    async def _upsert(self, chunks: List[DocumentChunk]) -> List[str]:
        """
        Takes in a list of list of document chunks and inserts them into the database.
        Return a list of document ids.
        """
        doc_ids = []

        with self.client.batch as batch:
            batch.batch_size=100
            # Batch import all documents
            for chunk in chunks:
                print(f"importing document: {chunk.title}")

                properties = {
                    "title": chunk.title,
                    "url": chunk.url,
                    "source_id": chunk.metadata.source_id,
                    "document_id": chunk.metadata.document_id,
                    "tenant_id": chunk.metadata.tenant_id,
                    "text": chunk.text,
                    "source_type": chunk.source_type
                }
                batch.add_data_object(properties, WEAVIATE_INDEX, chunk.metadata.chunk_id)
                doc_ids.append(chunk.metadata.chunk_id)
        return doc_ids

    async def _query(
        self,
        queries: List[QueryWithEmbedding],
        tenant_id: str
    ) -> List[QueryResult]:
        """
        Takes in a list of queries with embeddings and filters and returns a list of query results with matching document chunks and scores.
        """
        print(queries)
        async def _single_query(query: QueryWithEmbedding) -> QueryResult:
            query_filter = DocumentMetadataFilter(tenant_id=tenant_id)

            if query.filter and query.filter.source_type:
                query_filter.source_type = query.filter.source_type

            filters_ = self.build_filters(query_filter)

            # Remove problematic characters from weaviate query
            formatted_query = html.escape(query.query.replace("\n", " "))

            result = (
                self.client.query.get(
                    WEAVIATE_INDEX,
                    list(extract_schema_properties(SCHEMA)),
                )
                .with_hybrid(query=formatted_query, alpha=0.75)
                .with_where(filters_)
                .with_limit(query.top_k)  # type: ignore
                .with_additional(["score", "vector"])
                .do()
            )
            query_results: List[DocumentChunkWithScore] = []
            response = result["data"]["Get"][WEAVIATE_INDEX]

            for resp in response:
                result = DocumentChunkWithScore(
                    text=resp["text"],
                    title=resp["title"],
                    url=resp["url"],
                    source_type=Source(resp["source_type"]),
                    metadata=DocumentChunkMetadata(
                        document_id=resp["document_id"],
                        chunk_id="",
                        source_id=resp["source_id"], 
                        tenant_id=resp["tenant_id"],
                    ),
                    embedding=resp["_additional"]["vector"],
                    score=resp["_additional"]["score"]
                )
                query_results.append(result)
            return QueryResult(query=query.query, results=query_results)

        return await asyncio.gather(*[_single_query(query) for query in queries])

    async def delete(
        self,
        ids: Optional[List[str]] = None,
        filter: Optional[DocumentMetadataFilter] = None,
        delete_all: Optional[bool] = None,
    ) -> bool:
        # TODO
        """
        Removes vectors by ids, filter, or everything in the datastore.
        Returns whether the operation was successful.
        """
        if delete_all:
            logger.debug(f"Deleting all vectors in index {WEAVIATE_INDEX}")
            self.client.schema.delete_all()
            return True

        if ids:
            operands = [
                {"path": ["document_id"], "operator": "Equal", "valueString": id}
                for id in ids
            ]

            where_clause = {"operator": "Or", "operands": operands}

            logger.debug(f"Deleting vectors from index {WEAVIATE_INDEX} with ids {ids}")
            result = self.client.batch.delete_objects(
                class_name=WEAVIATE_INDEX, where=where_clause, output="verbose"
            )

            if not bool(result["results"]["successful"]):
                logger.debug(
                    f"Failed to delete the following objects: {result['results']['objects']}"
                )

        if filter:
            where_clause = self.build_filters(filter)

            logger.debug(
                f"Deleting vectors from index {WEAVIATE_INDEX} with filter {where_clause}"
            )
            result = self.client.batch.delete_objects(
                class_name=WEAVIATE_INDEX, where=where_clause
            )

            if not bool(result["results"]["successful"]):
                logger.debug(
                    f"Failed to delete the following objects: {result['results']['objects']}"
                )

        return True

    @staticmethod
    def build_filters(filter):
        if filter.source_type:
            filter.source_type = filter.source_type.value

        operands = []
        filter_conditions = {
            "source_type": {
                "operator": "Equal",
                "value": "query.filter.source_type.value",
                "value_key": "valueString",
            },
            "start_date": {"operator": "GreaterThanEqual", "value_key": "valueDate"},
            "end_date": {"operator": "LessThanEqual", "value_key": "valueDate"},
            "default": {"operator": "Equal", "value_key": "valueString"},
        }

        for attr, value in filter.__dict__.items():
            if value is not None:
                filter_condition = filter_conditions.get(
                    attr, filter_conditions["default"]
                )
                value_key = filter_condition["value_key"]

                operand = {
                    "path": [
                        attr
                        if not (attr == "start_date" or attr == "end_date")
                        else "created_at"
                    ],
                    "operator": filter_condition["operator"],
                    value_key: value,
                }

                operands.append(operand)

        return {"operator": "And", "operands": operands}
