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
    BusinessFiles,
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

    def get_vectordb_filenames(self, business_id: str) -> List[str]:

        docs = self.vellum_client.documents.list(document_index_id=business_id)

        return [doc.label for doc in docs.results]

    async def vectorize_file(self, db: Database, business_id: str, filepath: str):
        file = await db.get_file(filepath)
        # label is the name of the file without the directory
        label = os.path.basename(filepath)
        self.vellum_client.documents.upload(
            document_index_id=business_id,
            external_id=label,
            label=label,
            file=file,
        )
