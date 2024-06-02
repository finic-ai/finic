import io
from fastapi import UploadFile
from typing import List, Optional, Tuple
from models.models import (
    AppConfig,
    User,
    Business,
    Lender,
    LoanApplication,
    LoanStatus,
    VellumDocument,
    ProcessingState,
    Message,
    MessageSender,
)
from supabase import create_client, Client
import os
from storage3.utils import StorageException
from io import StringIO
from bs4 import BeautifulSoup
import pandas as pd
import httpx
import datetime
from pypdf import PdfWriter, PdfReader
import fitz
import vellum
from vellum.client import Vellum
import vellum.types as types
import json
from database import Database


class AI:
    def __init__(self):
        vellum_api_key = os.environ.get("VELLUM_API_KEY")
        self.vellum_client = Vellum(api_key=vellum_api_key)

    def get_vectordb_filenames(
        self, user_id: str, business: Business
    ) -> List[VellumDocument]:

        if not business.has_vectordb:
            return []

        docs = self.vellum_client.documents.list(document_index_id=business.id)

        return [
            VellumDocument(
                filename=doc.label,
                filepath=f"{user_id}/{business.id}/{doc.external_id}",
                processing_state=ProcessingState(doc.processing_state),
            )
            for doc in docs.results
        ]

    async def create_vectordb_index(self, db: Database, business: Business) -> str:

        response = self.vellum_client.document_indexes.create(
            label=business.company_name,
            name=business.id,
            indexing_config={
                "vectorizer": {
                    "model_name": "intfloat/multilingual-e5-large",
                },
                "chunking": {
                    "chunker_name": "reducto-chunker",
                },
            },
        )
        business.has_vectordb = True
        await db.upsert_business(business)
        return response.id

    async def vectorize_file(
        self, db: Database, business: Business, filepath: str
    ) -> str:
        # if we dont already a vectordb document for this business, create one
        if not business.has_vectordb:
            # if True:
            print("creating vectordb index")
            index = await self.create_vectordb_index(db=db, business=business)
            print(index)

        file = await db.get_diligence_file(filepath)
        # label is the name of the file without the directory
        label = os.path.basename(filepath)
        try:
            print("uploading file")
            response = self.vellum_client.documents.upload(
                add_to_index_names=[business.id],
                external_id=label,
                label=label,
                contents=file,
            )
            return response.document_id
        except Exception as e:
            print(e)
            raise e

    async def chat(self, messages: List[Message], business: Business):
        result = self.vellum_client.execute_workflow(
            workflow_deployment_name="dilligence-chatbot",
            release_tag="LATEST",
            inputs=[
                types.WorkflowRequestInputRequest_ChatHistory(
                    type="CHAT_HISTORY",
                    name="chat_history",
                    value=[
                        types.ChatMessageRequest(role=message.sender, text=message.text)
                        for message in messages
                    ],
                ),
                types.WorkflowRequestInputRequest_String(
                    type="STRING",
                    name="search_index",
                    value=business.id,
                ),
            ],
        )
        if result.data.state == "REJECTED":
            raise Exception(result.data.error.message)

        for output in result.data.outputs:
            print(output)

        string_output = result.data.outputs[0].value

        # Parse to json
        output = json.loads(string_output)
        return output
