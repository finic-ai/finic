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
import requests
from database import Database


class DataConnector:
    def __init__(self):
        nango_api_key = os.environ.get("NANGO_API_KEY")
        self.nango_params = {"provider_config_key": "quickbooks"}

        self.nango_headers = {"Authorization": f"Bearer {nango_api_key}"}

    def get_quickbooks_connection(self, user_id: str):
        url = f"https://api.nango.dev/connection/{user_id}"
        response = requests.request(
            "GET", url, headers=self.nango_headers, params=self.nango_params
        )

        parsed = response.json()

        print(parsed)

        return parsed
