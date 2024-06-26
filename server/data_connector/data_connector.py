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
import base64


class DataConnector:
    def __init__(self):
        nango_api_key = os.environ.get("NANGO_API_KEY")
        self.nango_params = {"provider_config_key": "quickbooks"}
        self.nango_headers = {"Authorization": f"Bearer {nango_api_key}"}

    def get_quickbooks_connection(self, user_id: str):
        url = f"https://api.nango.dev/connection/{user_id}?refresh_token=true"
        response = requests.request(
            "GET", url, headers=self.nango_headers, params=self.nango_params
        )

        parsed = response.json()

        print(parsed)

        return parsed

    def revoke_quickbooks_token(self, token: str):
        quickbooks_client_id = os.environ.get("QUICKBOOKS_CLIENT_ID")
        quickbooks_client_secret = os.environ.get("QUICKBOOKS_CLIENT_SECRET")
        url = "https://developer.api.intuit.com/v2/oauth2/tokens/revoke"

        auth_str = f"{quickbooks_client_id}:{quickbooks_client_secret}"
        b64_auth_str = base64.b64encode(auth_str.encode()).decode()

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {b64_auth_str}",
        }

        data = {
            "token": token,
        }

        response = requests.request("POST", url, headers=headers, data=data)

        print(response)
        return response

    def disconnect_quickbooks(self, user_id: str):
        connection = self.get_quickbooks_connection(user_id)
        access_token = connection["credentials"]["access_token"]
        refresh_token = connection["credentials"]["refresh_token"]

        # self.revoke_quickbooks_token(access_token)
        self.revoke_quickbooks_token(refresh_token)
        url = f"https://api.nango.dev/connection/{user_id}"
        response = requests.request(
            "DELETE", url, headers=self.nango_headers, params=self.nango_params
        )

        print(response)

        return response
