from datastore.datastore import DataStore
from models.models import (
    AppConfig,
    Vectorstore,
)
from appstatestore.statestore import StateStore
import os
from datastore.providers.weaviate_datastore import WeaviateDataStore
from datastore.providers.pinecone_datastore import PineconeDataStore
from datastore.providers.milvus_datastore import MilvusDataStore
from typing import Optional


default_vectorstore = WeaviateDataStore()


def get_datastore(config: AppConfig) -> DataStore:
    vectorstore = config.vectorstore_id
    
    print(vectorstore)

    if vectorstore == Vectorstore.default:
        return default_vectorstore
    elif vectorstore == Vectorstore.weaviate:
        return default_vectorstore
    elif vectorstore == Vectorstore.pinecone:
        credentials = StateStore().load_vectorstore_credentials(config, vectorstore)
        if credentials is None:
            raise ValueError("No credentials found for vectorstore")
        return PineconeDataStore(credentials=credentials)
    elif vectorstore == Vectorstore.milvus:
        return MilvusDataStore()


        
def update_vectorstore(config: AppConfig, vectorstore: Vectorstore, credentials: Optional[str]) -> None:
    if vectorstore == Vectorstore.pinecone:
        datastore = PineconeDataStore(credentials=credentials)
    if vectorstore == Vectorstore.milvus:
        datastore = MilvusDataStore()
    StateStore().update_vectorstore(config, vectorstore, credentials)
