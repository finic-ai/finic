from models.models import Source, AppConfig, Document, DocumentMetadata, DocumentChunk, DataConnector
from typing import List, Optional
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import os
import uuid
import json
import importlib
from typing import Any

SCOPES = ['https://www.googleapis.com/auth/drive']
CLIENT_SECRETS = os.environ.get("GDRIVE_CLIENT_SECRETS")
DASHBOARD_URL = os.environ.get("DASHBOARD_URL")

class GoogleDocsConnector(DataConnector):
    source_type: Source = Source.google_docs
    config: AppConfig
    folder_name: str
    auth_code: Optional[str] = None
    flow: Optional[Any] = None
    service: Optional[Any] = None

    def __init__(self, config: AppConfig, folder_name: str, auth_code: Optional[str]):
        super().__init__(config=config, folder_name=folder_name, auth_code=auth_code)
        
        # Set up the OAuth flow
        client_secrets = json.loads(CLIENT_SECRETS)
        self.flow = InstalledAppFlow.from_client_config(
            client_secrets,
            SCOPES, 
            redirect_uri='{}/google-drive'.format(DASHBOARD_URL) 
        )        

    async def authorize(self) -> str | None:
        # Exchange the authorization code for credentials
        if self.auth_code is None:
            print("auth code is none")
            # Generate the authorization URL
            auth_url, _ = self.flow.authorization_url(prompt='consent')
            return auth_url

        print("fetching token")
        self.flow.fetch_token(code=self.auth_code)
        
        # Build the Google Drive API client with the credentials
        creds = self.flow.credentials
        print(creds)
        self.service = build('drive', 'v3', credentials=creds)

    async def load(self, source_id: str) -> List[Document]:
        print("loading documents")
        folder_query = f"name='{self.folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
        folder_result = self.service.files().list(q=folder_query, fields="nextPageToken, files(id)").execute()
        folder_items = folder_result.get('files', [])
        print("folder items:", folder_items)

        if len(folder_items) == 0:
            print(f"No folder named '{self.folder_name}' was found.")
            raise Exception(f"No folder named '{self.folder_name}' was found.")
        elif len(folder_items) > 1:
            print(f"Multiple folders named '{self.folder_name}' were found. Using the first one.")

        folder_id = folder_items[0]['id']

        # List the files in the specified folder
        results = self.service.files().list(q=f"'{folder_id}' in parents and trashed = false",
                                    fields="nextPageToken, files(id, name, webViewLink)").execute()
        items = results.get('files', [])

        print(items)


        documents: List[Document] = []
        # Loop through each file and create documents
        for item in items:
            # Check if the file is a Google Doc
            # Retrieve the full metadata for the file
            file_metadata = self.service.files().get(fileId=item['id']).execute()
            mime_type = file_metadata.get('mimeType', '')
            if mime_type != 'application/vnd.google-apps.document':
                continue

            # Retrieve the document content
            doc = self.service.files().export(fileId=item['id'], mimeType='text/plain').execute()
            content = doc.decode('utf-8')

            documents.append(
                Document(
                    title=item['name'],
                    text=content,
                    url=item['webViewLink'],
                    source_type=Source.google_docs,
                    metadata=DocumentMetadata(
                        document_id=str(uuid.uuid4()),
                        source_id=source_id,
                        tenant_id=self.config.tenant_id
                    )
                )
            )
        return documents