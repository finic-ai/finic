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
from database import Database


class AI:
    def __init__(self):
        vellum_api_key = os.environ.get("VELLUM_API_KEY")
        self.vellum_client = Vellum(api_key=vellum_api_key)

    def get_vectordb_filenames(self, business: Business) -> List[VellumDocument]:

        if not business.has_vectordb:
            return []

        docs = self.vellum_client.documents.list(document_index_id=business.id)

        return [
            VellumDocument(
                filename=doc.label,
                processing_state=ProcessingState(doc.processing_state),
            )
            for doc in docs.results
        ]

    async def create_vectordb_index(self, db: Database, business: Business) -> str:
        if business.has_vectordb:
            return business.id

        response = self.vellum_client.document_indexes.create()
        business.has_vectordb = True
        business.id = response.index_id
        await db.upsert_business(business)
        return response.index_id

    async def vectorize_file(
        self, db: Database, business: Business, filepath: str
    ) -> str:
        # if we dont already a vectordb document for this business, create one
        if not business.has_vectordb:
            business.has_vectordb = True
            await db.upsert_business(business)
        file = await db.get_file(filepath)
        # label is the name of the file without the directory
        label = os.path.basename(filepath)
        try:
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
