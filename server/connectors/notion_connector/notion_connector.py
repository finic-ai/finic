import requests
import os
import json
from typing import Dict, List, Optional
from models.models import (
    AppConfig,
    Document,
    ConnectorId,
    DocumentConnector,
    AuthorizationResult,
    Section,
    ConnectionFilter,
    SectionType,
)
from models.api import GetDocumentsResponse
from appstatestore.statestore import StateStore
import base64
from .notion_parser import NotionParser
from urllib.parse import urlencode, urlunparse, urlparse, ParseResult


BASE_URL = "https://api.notion.com"


class NotionConnector(DocumentConnector):
    connector_id: ConnectorId = ConnectorId.notion
    config: AppConfig
    headers: Dict = {}

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize_api_key(self) -> AuthorizationResult:
        pass

    async def authorize(
        self, account_id: str, auth_code: Optional[str], metadata: Optional[Dict]
    ) -> AuthorizationResult:
        connector_credentials = StateStore().get_connector_credential(
            self.connector_id, self.config
        )
        try:
            client_id = connector_credentials["client_id"]
            client_secret = connector_credentials["client_secret"]

            redirect_uri = connector_credentials["redirect_uri"]
            authorization_url = f"https://api.notion.com/v1/oauth/authorize"
            params = {
                "response_type": "code",
                "redirect_uri": redirect_uri,
                "client_id": client_id,
                "owner": "user",
            }
            encoded_params = urlencode(params)
            url_parts = urlparse(authorization_url)
            authorization_url = ParseResult(
                scheme=url_parts.scheme,
                netloc=url_parts.netloc,
                path=url_parts.path,
                params=url_parts.params,
                query=encoded_params,
                fragment=url_parts.fragment,
            ).geturl()
        except Exception as e:
            raise Exception("Connector is not enabled")

        if not auth_code:
            return AuthorizationResult(authorized=False, auth_url=authorization_url)

        try:
            # encode in base 64
            encoded = base64.b64encode(
                f"{client_id}:{client_secret}".encode("utf-8")
            ).decode("utf-8")
            headers = {
                "Authorization": f"Basic {encoded}",
                "Content-Type": "application/json",
                "Notion-Version": "2022-06-28",
            }

            data = {
                "code": auth_code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
            }

            response = requests.post(
                f"{BASE_URL}/v1/oauth/token", headers=headers, json=data
            )

            creds = response.json()

            creds_string = json.dumps(creds)
            workspace_name = creds["workspace_name"]

        except Exception as e:
            print(e)
            raise Exception("Unable to get access token with code")

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=creds_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={
                "workspace_name": workspace_name,
            },
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    async def get_sections(self, account_id: str) -> List[Section]:
        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )
        credential_string = connection.credential
        credential_json = json.loads(credential_string)
        access_token = credential_json["access_token"]
        parser = NotionParser(access_token)
        all_pages, _ = parser.notion_search({})

        id_to_section = {}
        id_to_parent = {}
        id_to_parent_type = {}

        # Create all sections and store parent ids
        for page in all_pages:
            print(page)
            id = page["id"]
            name = parser.parse_title(page)
            parent_id = page["parent"].get("id")
            parent_type = page["parent"]["type"]
            id_to_section[id] = Section(
                id=id, name=name, type=SectionType.folder, children=[]
            )
            id_to_parent[id] = parent_id
            id_to_parent_type[id] = parent_type

        # Assign each section to its parent
        for id, section in id_to_section.items():
            parent_id = id_to_parent[id]
            parent_type = id_to_parent_type[id]

            # If parent is not a workspace, add this section to its parent's children
            if parent_type != "workspace" and parent_id in id_to_section:
                id_to_section[parent_id].children.append(section)

        # Return all sections whose parent is a workspace
        return [
            section
            for id, section in id_to_section.items()
            if id_to_parent_type[id] == "workspace"
        ]

    async def load(self, connection_filter: ConnectionFilter) -> GetDocumentsResponse:
        account_id = connection_filter.account_id
        uris = connection_filter.uris
        section_filter = connection_filter.section_filter_id

        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )
        credential_string = connection.credential
        credential_json = json.loads(credential_string)
        access_token = credential_json["access_token"]

        parser = NotionParser(access_token)

        all_notion_documents = []
        next_cursor = None
        if uris:
            for uri in uris:
                page = parser.notion_get_page(uri)
                all_notion_documents.append(page)
        elif section_filter:
            # retrieve the SectionFilter based on the section_filter id
            connection_filter = ConnectionFilter(
                connector_id=self.connector_id, account_id=account_id
            )
            connections = StateStore().get_connections(
                filter=connection_filter,
                config=self.config,
            )
            connection = connections[0]
            filters = connection.section_filters
            # get the filter with the right id
            sections = []
            for filter in filters:
                if filter.id == section_filter:
                    sections = filter.sections

            for section in sections:
                items = parser.get_documents_in_section(section.id)
                for item in items:
                    all_notion_documents.append(
                        Document(
                            title=item["title"],
                            content=item["content"],
                            uri=item["uri"],
                            connector_id=self.connector_id,
                            account_id=account_id,
                        )
                    )

            return all_notion_documents
        else:
            search_params = {}

            if connection_filter.page_size is not None:
                search_params["page_size"] = connection_filter.page_size
            if connection_filter.page_cursor is not None:
                search_params["start_cursor"] = connection_filter.page_cursor
            all_notion_documents, next_cursor = parser.notion_search(search_params)
            print(all_notion_documents)

        documents: List[Document] = []
        for item in all_notion_documents:
            object_type = item.get("object")
            object_id = item.get("id")
            url = item.get("url")
            title = ""

            if object_type == "page":
                title = parser.parse_title(item)
                blocks = parser.notion_get_blocks(object_id)
                html = parser.parse_notion_blocks(blocks)
                properties_html = parser.parse_properties(item)
                html = f"<div><h1>{title}</h1>{properties_html}{html}</div>"
                documents.append(
                    Document(
                        title=title,
                        content=html,
                        connector_id=self.connector_id,
                        account_id=account_id,
                        uri=url,
                    )
                )
        return GetDocumentsResponse(documents=documents, next_page_cursor=next_cursor)
