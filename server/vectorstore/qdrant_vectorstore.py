import os
from models.models import Document as PsychicDocument, VectorStore, AppConfig
from typing import List, Any, Optional
import uuid
from qdrant_client import QdrantClient
from langchain.docstore.document import Document
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from qdrant_client.models import PointStruct, Distance, VectorParams, ScoredPoint
from qdrant_client.http import models as rest


embeddings_model = SentenceTransformer(
    os.environ.get("embeddings_model") or "all-MiniLM-L6-v2"
)
embeddings_dimension = 384


class QdrantVectorStore(VectorStore):
    client: Optional[QdrantClient] = None
    collection_name: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True

    def __init__(self):
        # self.client = Qdrant.from_documents(
        #     [],
        #     embeddings,
        #     path="/tmp/local_qdrant",
        #     collection_name="my_documents",
        # )

        super().__init__()
        if not os.getenv("QDRANT_URL"):
            raise Exception("QDRANT_URL must be set as an environment variable.")
        qdrant_port = os.getenv("QDRANT_PORT") or "6333"
        api_key = os.getenv("QDRANT_API_KEY")
        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"), port=qdrant_port, api_key=api_key
        )
        try:
            self.client.get_collection(collection_name="my_documents")
        except:
            self.client.create_collection(
                collection_name="my_documents",
                vectors_config=VectorParams(
                    size=embeddings_dimension, distance=Distance.COSINE
                ),
            )
        self.collection_name = "my_documents"

    async def upsert(
        self, documents: List[PsychicDocument], app_config: AppConfig
    ) -> bool:
        langchain_docs = [
            Document(
                page_content=doc.content,
                metadata={"title": doc.title, "id": doc.id, "source": doc.uri},
            )
            for doc in documents
        ]
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=100
        )
        split_docs = text_splitter.split_documents(langchain_docs)

        points = []
        seen_docs = {}

        for doc in split_docs:
            doc_id = None
            if doc.metadata["id"] not in seen_docs:
                doc_id = doc.metadata["id"]
                seen_docs[doc.metadata["id"]] = 1
                chunk_id = uuid.uuid5(uuid.NAMESPACE_DNS, f"{doc_id}_1")
            else:
                doc_id = doc.metadata["id"]
                seen_docs[doc.metadata["id"]] += 1
                chunk_id = uuid.uuid5(
                    uuid.NAMESPACE_DNS, f"{doc_id}_{seen_docs[doc.metadata['id']]}"
                )

            # TODO: Fix this so that the vector output is of the format PointStruct expects
            vector = embeddings_model.encode([doc.page_content])[0]
            vector = vector.tolist()

            points.append(
                PointStruct(
                    id=str(chunk_id),
                    payload={
                        "metadata": {
                            "tenant_id": app_config.app_id,
                            "title": doc.metadata["title"],
                            "source": doc.metadata["source"],
                            "chunk_id": chunk_id,
                            "doc_id": doc_id,
                        },
                        "content": doc.page_content,
                    },
                    vector=vector,
                )
            )

        self.client.upsert(collection_name=self.collection_name, points=points)
        return True

    async def query(self, query: str, app_config: AppConfig) -> List[PsychicDocument]:
        query_vector = embeddings_model.encode([query])[0]
        query_vector = query_vector.tolist()
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            query_filter={
                "must": [
                    {"key": "metadata.tenant_id", "match": {"value": app_config.app_id}}
                ]
            },
            limit=5,
        )
        print(results)
        results = [
            PsychicDocument(
                id=doc.payload["metadata"]["doc_id"],
                title=doc.payload["metadata"]["title"],
                content=doc.payload["content"],
                uri=doc.payload["metadata"]["source"],
            )
            for doc in results
        ]
        return results
