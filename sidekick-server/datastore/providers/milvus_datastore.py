import json
import os
import asyncio
from loguru import logger
import openai

from typing import Dict, List, Optional
from pymilvus import (
    Collection,
    connections,
    utility,
    FieldSchema,
    DataType,
    CollectionSchema,
    MilvusException,
)
from uuid import uuid4

from datastore.datastore import DataStore
from models.models import (
    DocumentChunk,
    DocumentChunkMetadata,
    Source,
    DocumentMetadataFilter,
    QueryResult,
    QueryWithEmbedding,
    DocumentChunkWithScore,
)

MILVUS_COLLECTION = os.environ.get("MILVUS_COLLECTION") or "c" + uuid4().hex
MILVUS_HOST = os.environ.get("MILVUS_HOST", "localhost")
MILVUS_PORT = os.environ.get("MILVUS_PORT", "19530")
MILVUS_USER = os.environ.get("MILVUS_USER")
MILVUS_PASSWORD = os.environ.get("MILVUS_PASSWORD")
MILVUS_USE_SECURITY = False if MILVUS_PASSWORD is None else True

MILVUS_INDEX_PARAMS = os.environ.get("MILVUS_INDEX_PARAMS")
MILVUS_SEARCH_PARAMS = os.environ.get("MILVUS_SEARCH_PARAMS")
MILVUS_CONSISTENCY_LEVEL = os.environ.get("MILVUS_CONSISTENCY_LEVEL")

UPSERT_BATCH_SIZE = 20
OUTPUT_DIM = 1536


SCHEMA = [
    (
        "id",
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, description="primary id", auto_id=True),
    ),
    (
        "embedding",
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=OUTPUT_DIM),
    ),
    (
        "title",
        FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=65535),
    ),
    (
        "url",
        FieldSchema(name="url", dtype=DataType.VARCHAR, max_length=65535),
    ),
    (
        "source_type",
        FieldSchema(name="source_type", dtype=DataType.VARCHAR, max_length=65535),
    ),
    (
        "source_id",
        FieldSchema(name="source_id", dtype=DataType.VARCHAR, max_length=65535),
        "",
    ),
    (
        "document_id",
        FieldSchema(name="document_id", dtype=DataType.VARCHAR, max_length=65535),
        "",
    ),
    (
        "tenant_id",
        FieldSchema(name="tenant_id", dtype=DataType.VARCHAR, max_length=65535),
        "",
    ),
    (
        "text",
        FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=65535),
    )

]


class MilvusDataStore(DataStore):
    def __init__(
            self,
            create_new: Optional[bool] = False,
            consistency_level: str = "Bounded",
    ):

        # Overwrite the default consistency level by MILVUS_CONSISTENCY_LEVEL
        self._consistency_level = MILVUS_CONSISTENCY_LEVEL or consistency_level
        self._create_connection()

        self._create_collection(MILVUS_COLLECTION, create_new)  # type: ignore
        self._create_index()

    def _create_connection(self):
        try:
            self.alias = ""
            # Check if the connection already exists
            for x in connections.list_connections():
                addr = connections.get_connection_addr(x[0])
                if x[1] and ('address' in addr) and (addr['address'] == "{}:{}".format(MILVUS_HOST, MILVUS_PORT)):
                    self.alias = x[0]

                    logger.debug("Reuse connection to Milvus server '{}:{}' with alias '{:s}'"
                                 .format(MILVUS_HOST, MILVUS_PORT, self.alias))
                    break

            # Connect to the Milvus instance using the passed in Environment variables
            if len(self.alias) == 0:
                self.alias = "default"
                connections.connect(
                    alias=self.alias,
                    host=MILVUS_HOST,
                    port=MILVUS_PORT,
                    user=MILVUS_USER,
                    password=MILVUS_PASSWORD,
                    secure=MILVUS_USE_SECURITY,
                )

                logger.debug("Connecting to milvus server '{}:{}' with alias '{:s}'"
                             .format(MILVUS_HOST, MILVUS_PORT, self.alias))
        except Exception as e:
            print(e)
            logger.debug("Failed to create connection to Milvus server '{}:{}', error: {}"
                         .format(MILVUS_HOST, MILVUS_PORT, e))

    def _create_collection(self, collection_name, create_new: bool) -> None:
        try:
            # If the collection exists and create_new is True, drop the existing collection
            if utility.has_collection(collection_name, using=self.alias) and create_new:
                utility.drop_collection(collection_name, using=self.alias)

            # Check if the collection doesn't exist
            if utility.has_collection(collection_name, using=self.alias) is False:
                # If it doesn't exist use the field params from init to create a new schem
                schema = [field[1] for field in SCHEMA]
                schema = CollectionSchema(schema)
                # Use the schema to create a new collection
                self.col = Collection(
                    collection_name,
                    schema=schema,
                    using=self.alias,
                    consistency_level=self._consistency_level
                )
                logger.debug("Create Milvus collection '{}' with consistency level {}"
                             .format(collection_name, self._consistency_level))
            else:
                # If the collection exists, point to it
                self.col = Collection(
                    collection_name, using=self.alias
                )

                logger.debug("Milvus collection '{}'".format(collection_name))

        except Exception as e:
            print(e)
            logger.debug("Failed to create collection '{}', error: {}".format(collection_name, e))

    def _create_index(self):
        self.index_params = MILVUS_INDEX_PARAMS or None
        self.search_params = MILVUS_SEARCH_PARAMS or None
        index_field = "embedding"
        try:
            # If no index on the collection, create one
            print("existing indexes: ", self.col.indexes)
            if len(self.col.indexes) == 0:
                print("index_params: ", self.index_params)
                print("search params: ", self.search_params)
                if self.index_params is not None:
                    # Convert the string format to JSON format parameters passed by MILVUS_INDEX_PARAMS
                    self.index_params = json.loads(self.index_params)
                    logger.debug("Create Milvus index: {}".format(self.index_params))
                    # Create an index on the 'embedding' field with the index params found in init
                    self.col.create_index(field_name=index_field, index_params=self.index_params)
                else:
                    # If no index param supplied, to first create an index for Milvus

                    # Notes for what the index means:
                    # metric_type: IP (Inner product) The other option is "L2" which is euclidean distance
                    # nlist: is used for creating an index. It takes a large number of vectors and stores them into buckets

                    try:
                        default_index_params = {
                            "metric_type": "IP",
                            "index_type": "IVF_FLAT",
                            "params": {"nlist": 1024}
                        }
                        logger.debug("Attempting creation of Milvus '{}' index".format(default_index_params["index_type"]))
                        print("field name: ", index_field)
                        print("index params: ", default_index_params)
                        self.col.create_index(field_name=index_field, index_params=default_index_params)
                        self.index_params = default_index_params
                        logger.debug("Creation of Milvus '{}' index successful".format(default_index_params["index_type"]))
                    # If create fails, most likely due to being Zilliz Cloud instance, try to create an AutoIndex
                    except MilvusException as e:
                        print(e)
                        logger.debug("Failed to create index. Will try to automatically create new index")
                        default_index_params = {"metric_type": "IP", "index_type": "AUTOINDEX", "params": {}}
                        self.col.create_index(field_name=index_field, index_params=default_index_params)
                        self.index_params = default_index_params
                        logger.debug("Creation of Milvus default index successful")
            # If an index already exists, grab its params
            else:
                for index in self.col.indexes:
                    idx = index.to_dict()
                    if idx["field"] == index_field:
                        logger.debug("Index already exists: {}".format(idx))
                        self.index_params = idx['index_param']
                        break

            self.col.load()

            if self.search_params is not None:
                # Convert the string format to JSON format parameters passed by MILVUS_SEARCH_PARAMS
                self.search_params = json.loads(self.search_params)
            else:
                # The default search params
                metric_type = "IP"
                if "metric_type" in self.index_params:
                    metric_type = self.index_params["metric_type"]
                # nprobe: is used for searching. It is the number of buckets closest to the target vector
                default_search_params = {
                    "IVF_FLAT": {"metric_type": metric_type, "params": {"nprobe": 10}},
                    "IVF_SQ8": {"metric_type": metric_type, "params": {"nprobe": 10}},
                    "IVF_PQ": {"metric_type": metric_type, "params": {"nprobe": 10}},
                    "HNSW": {"metric_type": metric_type, "params": {"ef": 10}},
                    "RHNSW_FLAT": {"metric_type": metric_type, "params": {"ef": 10}},
                    "RHNSW_SQ": {"metric_type": metric_type, "params": {"ef": 10}},
                    "RHNSW_PQ": {"metric_type": metric_type, "params": {"ef": 10}},
                    "IVF_HNSW": {"metric_type": metric_type, "params": {"nprobe": 10, "ef": 10}},
                    "ANNOY": {"metric_type": metric_type, "params": {"search_k": 10}},
                    "AUTOINDEX": {"metric_type": metric_type, "params": {}},
                }
                # Set the search params
                self.search_params = default_search_params[self.index_params["index_type"]]
            logger.debug("Milvus search parameters: {}".format(self.search_params))
        except Exception as e:
            logger.debug("Failed to create index, error: {}".format(e))

    async def _upsert(self, chunks: List[DocumentChunk]) -> List[str]:
        """
            Takes in a list of list of document chunks and inserts them into the database.
            Return a list of document ids.
        """

        try:
            data, doc_ids = self.extract_data_from_chunks(chunks)
            batches = [
                data[i: i + UPSERT_BATCH_SIZE]
                for i in range(0, len(data), UPSERT_BATCH_SIZE)
            ]

            for batch in batches:
                if len(batch[0]) != 0:
                    try:
                        logger.debug(f"Upserting batch of size {len(batch[0])}")
                        self.col.insert(batch)
                        logger.debug(f"Upserted batch successfully")
                    except Exception as e:
                        print(e)
                        logger.debug(f"Failed to insert batch records, error: {e}")

            # This setting perfoms flushes after insert. Small insert == bad to use
            # self.col.flush()
            return doc_ids
        except Exception as e:
            logger.debug("Failed to insert records, error: {}".format(e))
            return []

    def get_embeddings(self, chunks: List[DocumentChunk]) -> List[List[float]]:
        texts = [(chunk.title + " " + chunk.text) for chunk in chunks]
        response = openai.Embedding.create(input=texts, model="text-embedding-ada-002")
        data = response["data"]
        return [result["embedding"] for result in data]

    def get_embeddings_from_text(self, text: str) -> List[List[float]]:
        response = openai.Embedding.create(input=text, model="text-embedding-ada-002")
        data = response["data"]
        return [result["embedding"] for result in data]

    def extract_data_from_chunks(self, chunks: List[DocumentChunk]):
        result = {}
        for item in SCHEMA[1:]:
            name = item[0]
            result[name] = []

        embeddings = self.get_embeddings(chunks)
        doc_ids = []

        for i in range(len(chunks)):
            chunk = chunks[i]
            chunk_properties = {
                "title": chunk.title,
                "url": chunk.url,
                "source_id": chunk.metadata.source_id,
                "document_id": chunk.metadata.document_id,
                "tenant_id": chunk.metadata.tenant_id,
                "text": chunk.text,
                "source_type": chunk.source_type,
                "embedding": embeddings[i]
            }
            for key, value in chunk_properties.items():
                result[key].append(value)

            doc_ids.append(chunk.metadata.chunk_id)

        return list(result.values()), doc_ids

    async def _query(self, queries: List[QueryWithEmbedding], tenant_id: str) -> List[QueryResult]:
        async def _single_query(query: QueryWithEmbedding) -> QueryResult:
            query_filter = DocumentMetadataFilter(tenant_id=tenant_id)
            try:
                if query.filter and query.filter.source_type:
                    query_filter.source_type = query.filter.source_type
                filters = self.build_filters(query_filter)
                embeddings = self.get_embeddings_from_text(query.query)
                # Perform our search
                temp_schema = []
                for field in SCHEMA:
                    if field[0] != "embedding":
                        temp_schema.append(field[0])

                res = self.col.search(
                    data=[embeddings[0]],
                    anns_field="embedding",
                    param=self.search_params,
                    limit=query.top_k,
                    expr=filters,
                    output_fields=temp_schema,  # Ignoring embedding
                )
                query_results: List[DocumentChunkWithScore] = []
                hits = res[0]
                for hit in hits:
                    score = hit.score
                    chunk_id = hit.id

                    query_results.append(
                        DocumentChunkWithScore(
                            title=hit.entity.value_of_field("title"),
                            url=hit.entity.value_of_field("url"),
                            text=hit.entity.value_of_field("text"),
                            source_type=hit.entity.value_of_field("source_type"),
                            score=score,
                            metadata=DocumentChunkMetadata(
                                chunk_id=chunk_id,
                                document_id=hit.entity.value_of_field("document_id"),
                                source_id=hit.entity.value_of_field("source_id"),
                                tenant_id=hit.entity.value_of_field("tenant_id"),
                            )
                        )
                    )
                return QueryResult(query=query.query, results=query_results)

            except Exception as e:
                logger.debug("Failed to query, error: {}".format(e))
                return QueryResult(query=query.query, results=[])

        return await asyncio.gather(*[_single_query(query) for query in queries])

    @staticmethod
    def build_filters(filter: DocumentMetadataFilter) -> Optional[str]:
        """Converts a DocumentMetdataFilter to the expression that Milvus takes.
        Args:
            filter (DocumentMetadataFilter): The Filter to convert to Milvus expression.
        Returns:
            Optional[str]: The filter if valid, otherwise None.
        """
        filters = []
        if filter.source_type:
            filter.source_type = filter.source_type.value
        for field, value in filter.dict().items():
            if value is not None:
                filters.append("(" + field + ' == "' + str(value) + '")')

        return " and ".join(filters)

    async def delete(
            self,
            ids: Optional[List[str]] = None,
            filter: Optional[DocumentMetadataFilter] = None,
            delete_all: Optional[bool] = None,
    ) -> bool:
        """Delete the entities based either on the chunk_id of the vector,
        Args:
            ids (Optional[List[str]], optional): The document_ids to delete. Defaults to None.
            filter (Optional[DocumentMetadataFilter], optional): The filter to delete by. Defaults to None.
            delete_all (Optional[bool], optional): Whether to drop the collection. Defaults to None.
        """
        print(f"GOING TO DELETE EVERYTHONG FROM {filter.source_type}")
        # If deleting all, drop and create the new collection
        if delete_all:
            coll_name = self.col.name
            logger.debug("Delete the entire collection {} and create new one".format(coll_name))
            # Release the collection from memory
            self.col.release()
            # Drop the collection
            self.col.drop()
            return True

        if ids and len(ids) > 0:
            try:
                # Add quotation marks around the string format id
                ids = ['"' + str(id) + '"' for id in ids]

                ids = self.col.query(f"document_id in [{','.join(ids)}]")
                # Note: Milvus only deletes entries based on the primary key using the "in" expression
                primary_key = "id"
                pks = [str(entry[primary_key]) for entry in ids]
                pks = ['"' + pk + '"' for pk in pks]
                res = self.col.delete(f"{primary_key} in [{','.join(pks)}]")

            except Exception as e:
                logger.debug("Failed to delete by ids, error: {}".format(e))

        if filter:
            try:
                # Convert filter to milvus expression
                filter = self.build_filters(filter)
                # Check if there is anything to filter
                if len(filter) != 0:
                    res = self.col.query(filter)
                    # Convert to list of pks
                    primary_key = "id"
                    pks = [str(entry[primary_key]) for entry in res]
                    res = self.col.delete(f"{primary_key} in [{','.join(pks)}]")

            except Exception as e:
                logger.debug("Failed to delete by filter, error: {}".format(e))

        # This setting performs flushes after delete. Small delete == bad to use
        # self.col.flush()

        return True



