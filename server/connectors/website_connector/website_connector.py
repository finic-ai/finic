from models.models import AppConfig, Document, ConnectorId, DocumentConnector, AuthorizationResult, ConnectionFilter, Section
from models.api import GetDocumentsResponse
from typing import List, Optional
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from appstatestore.statestore import StateStore
import os
import uuid
import json
import importlib
from typing import Any, Dict
import io 
from PyPDF2 import PdfReader
import re
from collections import deque

class WebsiteDriveConnector(DocumentConnector):
    connector_id: ConnectorId = ConnectorId.web
    config: AppConfig

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize_api_key(self) -> AuthorizationResult:
        pass              

    async def authorize(self, account_id: str, auth_code: Optional[str], metadata: Dict) -> AuthorizationResult:
        new_connection = StateStore().add_connection(
            config=self.config,
            credential="",
            connector_id=self.connector_id,
            account_id=account_id,
            metadata=metadata
        )
        return AuthorizationResult(authorized=True, connection=new_connection)
    
    async def get_sections(self, account_id: str) -> List[Section]:
        return []

    async def load(self, connection_filter: ConnectionFilter) -> GetDocumentsResponse:
        account_id = connection_filter.account_id
        uris = connection_filter.uris
        section_filter = connection_filter.section_filter_id
        # initialize credentials
        connection = StateStore().load_credentials(
            self.config, 
            self.connector_id,
            account_id 
        )

        url = connection.metadata['url']
        documents = []
        documents.append(
            Document(
                title="name",
                content="content",
                connector_id=self.connector_id,
                account_id=account_id,
                uri="webViewLink",
            )
        )
        return GetDocumentsResponse(documents=documents)

def get_id_from_folder_name(folder_name: str, service) -> str:
    print("loading documents")
    folder_query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    folder_result = service.files().list(q=folder_query, fields="nextPageToken, files(id)").execute()
    folder_items = folder_result.get('files', [])
    print("folder items:", folder_items)

    if len(folder_items) == 0:
        print(f"No folder named '{folder_name}' was found.")
        raise Exception(f"No folder named '{folder_name}' was found.")
    elif len(folder_items) > 1:
        print(f"Multiple folders named '{folder_name}' were found. Using the first one.")

    folder_id = folder_items[0]['id']
    return folder_id

def get_id_from_url(url: str):
    # Extract the folder ID from the link
    folder_id = re.search(r'folders/([\w-]+)', url)
    if folder_id:
        folder_id = folder_id.group(1)
        return folder_id
    else:
        raise Exception("Invalid Google Drive folder link.")
    
