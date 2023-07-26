from models.models import (
    AppConfig,
    Document,
    ConnectorId,
    DocumentConnector,
    AuthorizationResult,
    ConnectionFilter,
    Section,
)
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
from .google_drive_parser import GoogleDriveParser


SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]


def download_pdf(service, file_id) -> Optional[io.BytesIO]:
    file = None
    try:
        request = service.files().get_media(fileId=file_id)
        file = io.BytesIO(request.execute())
    except Exception as e:
        print(e)

    return file


def extract_pdf_text(pdf_file):
    reader = PdfReader(pdf_file)
    text = ""
    for page_num in range(len(reader.pages)):
        text += reader.pages[page_num].extract_text()
    return text


class GoogleDriveConnector(DocumentConnector):
    connector_id: ConnectorId = ConnectorId.gdrive
    config: AppConfig

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize_api_key(self) -> AuthorizationResult:
        pass

    async def authorize(
        self, account_id: str, auth_code: Optional[str], metadata: Dict
    ) -> AuthorizationResult:
        cred = StateStore().get_connector_credential(self.connector_id, self.config)
        try:
            custom_config = StateStore().get_connector_custom_config(
                self.connector_id, self.config
            )
        except Exception as e:
            print(e)
            custom_config = None

        client_secrets = cred["client_secrets"]
        developer_key = cred["developer_key"]

        # redirect_uri = client_secrets["web"]["redirect_uris"][0]
        redirect_uri = "https://link.psychic.dev/oauth/redirect"

        if custom_config and custom_config.get("scope"):
            scopes = custom_config["scope"]
        else:
            scopes = SCOPES

        # if settings.connector_configs and settings.connector_configs.get(self.connector_id):
        #     gdrive_configs = settings.connector_configs[self.connector_id]
        #     if gdrive_configs.get('folder_selection'):
        #         scopes = SCOPES_READONLY

        flow = InstalledAppFlow.from_client_config(
            client_secrets, scopes, redirect_uri=redirect_uri
        )

        if not auth_code:
            auth_url, _ = flow.authorization_url(prompt="consent")
            return AuthorizationResult(authorized=False, auth_url=auth_url)

        flow.fetch_token(code=auth_code)
        # Build the Google Drive API client with the credentials
        creds = flow.credentials
        creds_string = creds.to_json()

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=None,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={},
            new_credential=creds_string,
        )
        new_connection.credential = json.dumps(
            {
                "access_token": creds.token,
                "client_id": creds.client_id,
                "developer_key": developer_key,
            }
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    async def get_sections(self, account_id: str) -> List[Section]:
        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )

        credential_string = connection.credential

        credential_json = json.loads(credential_string)
        creds = Credentials.from_authorized_user_info(credential_json)
        service = build("drive", "v3", credentials=creds)

        parser = GoogleDriveParser(service)

        sections = parser.list_all_subfolders()

        return sections

    async def load(self, connection_filter: ConnectionFilter) -> GetDocumentsResponse:
        account_id = connection_filter.account_id
        uris = connection_filter.uris
        section_filter = connection_filter.section_filter_id
        # initialize credentials
        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )

        credential_string = connection.credential

        credential_json = json.loads(credential_string)
        creds = Credentials.from_authorized_user_info(credential_json)

        if not creds.valid and creds.refresh_token:
            creds.refresh(Request())
            creds_string = creds.to_json()
            StateStore().add_connection(
                config=connection.config,
                credential=creds_string,
                connector_id=self.connector_id,
                account_id=account_id,
                metadata={},
            )
        service = build("drive", "v3", credentials=creds)

        parser = GoogleDriveParser(service)

        # folder_contents = parser.list_files_in_folder(folder_id)
        # if len(folder_contents) == 0:
        #     raise Exception("Folder is empty")

        connection_filter = ConnectionFilter(
            connector_id=self.connector_id, account_id=account_id
        )
        connections = StateStore().get_connections(
            filter=connection_filter,
            config=self.config,
        )
        connection = connections[0]
        filters = connection.section_filters
        default_filter = None

        if filters:
            for filter in filters:
                if filter.id == "__default__":
                    default_filter = filter
                    break

        files = []
        if uris:
            files = parser.get_files_by_uris(uris)
        elif section_filter:
            # retrieve the SectionFilter based on the section_filter id

            # get the filter with the right id
            sections = []
            for filter in filters:
                if filter.id == section_filter:
                    sections = filter.sections

            for section in sections:
                files.extend(parser.get_all_files(section))

        else:
            if default_filter:
                for section in default_filter.sections:
                    files.extend(parser.get_all_files(section))
            else:
                files = []

        documents = []
        for item in files:
            mime_type = item.get("mimeType", "")
            if mime_type == "application/vnd.google-apps.document":
                doc = (
                    service.files()
                    .export(fileId=item["id"], mimeType="text/plain")
                    .execute()
                )
                content = doc.decode("utf-8")
            elif mime_type == "application/pdf":
                pdf_file = download_pdf(service, item["id"])
                if not pdf_file:
                    continue
                content = extract_pdf_text(pdf_file)
            documents.append(
                Document(
                    title=item["name"],
                    content=content,
                    connector_id=self.connector_id,
                    account_id=account_id,
                    uri=item["webViewLink"],
                )
            )
        return GetDocumentsResponse(documents=documents)


def get_id_from_folder_name(folder_name: str, service) -> str:
    print("loading documents")
    folder_query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    folder_result = (
        service.files()
        .list(q=folder_query, fields="nextPageToken, files(id)")
        .execute()
    )
    folder_items = folder_result.get("files", [])
    print("folder items:", folder_items)

    if len(folder_items) == 0:
        print(f"No folder named '{folder_name}' was found.")
        raise Exception(f"No folder named '{folder_name}' was found.")
    elif len(folder_items) > 1:
        print(
            f"Multiple folders named '{folder_name}' were found. Using the first one."
        )

    folder_id = folder_items[0]["id"]
    return folder_id


def get_id_from_url(url: str):
    # Extract the folder ID from the link
    folder_id = re.search(r"folders/([\w-]+)", url)
    if folder_id:
        folder_id = folder_id.group(1)
        return folder_id
    else:
        raise Exception("Invalid Google Drive folder link.")
