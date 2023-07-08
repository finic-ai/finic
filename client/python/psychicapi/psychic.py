import requests
from enum import Enum
from typing import List, Optional, Dict, Any


class ConnectorId(Enum):
    confluence = "confluence"
    dropbox = "dropbox"
    gdrive = "gdrive"
    github = "github"
    gmail = "gmail"
    hubspot = "hubspot"
    intercom = "intercom"
    notion = "notion"
    readme = "readme"
    salesforce = "salesforce"
    sharepoint = "sharepoint"
    slack = "slack"
    web = "web"
    zendesk = "zendesk"


class SectionType(str, Enum):
    folder = "folder"
    document = "document"


class Section:
    id: str
    name: str
    type: SectionType
    children: Optional[List["Section"]] = None

    def __init__(
        self,
        id: str,
        name: str,
        type: SectionType,
        children: Optional[List["Section"]] = None,
    ) -> None:
        self.id = id
        self.name = name
        self.type = type
        self.children = children


class SectionFilter:
    id: str
    sections: List[Section]

    def __init__(self, id: str, sections: List[Section]) -> None:
        self.id = id
        self.sections = sections


class ConnectionFilter:
    account_id: str
    connector_id: Optional[ConnectorId] = None
    uris: Optional[List[str]] = None
    section_filter_id: Optional[str] = None


class Connection:
    account_id: str
    connector_id: ConnectorId
    metadata: Dict
    section_filters: List[SectionFilter] = []
    sections: Optional[List[Section]] = None
    credential: Optional[str]
    config: Optional[Any]

    def __init__(
        self,
        account_id: str,
        connector_id: ConnectorId,
        metadata: Dict,
        section_filters: List[SectionFilter] = [],
        sections: Optional[List[Section]] = None,
        credential: Optional[str] = None,
        config: Optional[Any] = None,
    ) -> None:
        self.account_id = account_id
        self.connector_id = connector_id
        self.metadata = metadata
        self.section_filters = section_filters
        self.sections = sections
        self.credential = credential
        self.config = config


class GetConversationsResponse:
    messages: List[Dict]
    next_page_cursor: Optional[str] = None

    def __init__(self, messages: List[Dict], next_page_cursor: Optional[str]) -> None:
        self.messages = messages
        self.next_page_cursor = next_page_cursor


class GetDocumentsResponse:
    documents: List[Dict]
    next_page_cursor: Optional[str] = None

    def __init__(
        self, documents: List[Dict], next_page_cursor: Optional[str] = None
    ) -> None:
        self.documents = documents
        self.next_page_cursor = next_page_cursor


class ChunkingOptions:
    min_chunk_size: Optional[int] = None
    max_chunk_size: Optional[int] = None


class Psychic:
    def __init__(self, secret_key: str):
        self.api_url = "https://api.psychic.dev/"
        self.secret_key = secret_key

    def handle_http_error(self, response: requests.Response):
        if response.status_code == 401 or response.status_code == 403:
            raise Exception("Unauthorized: Invalid or missing secret key")
        try:
            data = response.json()
            message = data.get("detail", "No additional information")
        except requests.exceptions.JSONDecodeError:
            message = "No additional information"
        raise Exception(f"HTTP error {response.status_code}: {message}")

    def get_documents(
        self,
        *,
        account_id: str,
        connector_id: Optional[ConnectorId] = None,
        section_filter_id: Optional[str] = None,
        uris: Optional[List[str]] = None,
        chunked: Optional[bool] = False,
        min_chunk_size: Optional[int] = None,
        max_chunk_size: Optional[int] = None,
        page_cursor: Optional[str] = None,
        page_size: Optional[int] = 100,
    ):
        body = {
            "account_id": account_id,
            "connector_id": connector_id.value if connector_id is not None else None,
            "section_filter_id": section_filter_id,
            "uris": uris,
            "chunked": chunked,
            "min_chunk_size": min_chunk_size,
            "max_chunk_size": max_chunk_size,
            "page_cursor": page_cursor,
            "page_size": page_size,
        }
        response = requests.post(
            self.api_url + "get-documents",
            json=body,
            headers={
                "Authorization": "Bearer " + self.secret_key,
                "Accept": "application/json",
            },
        )
        if response.status_code == 200:
            data = response.json()
            documents = data["documents"]
            next_page_cursor = data["next_page_cursor"]
            return GetDocumentsResponse(
                documents=documents, next_page_cursor=next_page_cursor
            )
        else:
            self.handle_http_error(response)

    def get_connections(
        self,
        *,
        connector_id: Optional[ConnectorId] = None,
        account_id: Optional[str] = None,
    ):
        filter = {
            "connector_id": connector_id.value if connector_id is not None else None,
            "account_id": account_id,
        }

        response = requests.post(
            self.api_url + "get-connections",
            json={
                "filter": filter,
            },
            headers={
                "Authorization": "Bearer " + self.secret_key,
                "Accept": "application/json",
            },
        )
        if response.status_code == 200:
            connections = response.json()["connections"]
            for connection in connections:
                connection["connector_id"] = ConnectorId(connection["connector_id"])
                if connection.get("sections"):
                    connection["sections"] = [
                        Section(**section) for section in connection["sections"]
                    ]
                if connection.get("section_filters"):
                    typed_section_filters = []
                    for section_filter in connection["section_filters"]:
                        sections = [
                            Section(**section) for section in section_filter["sections"]
                        ]
                        id = section_filter["id"]
                        typed_section_filters.append(
                            SectionFilter(id=id, sections=sections)
                        )
                    connection["section_filters"] = typed_section_filters

            return [Connection(**connection) for connection in connections]
        else:
            self.handle_http_error(response)

    def add_section_filter(
        self,
        *,
        connector_id: ConnectorId,
        account_id: str,
        section_filter: SectionFilter,
    ):
        body = {
            "connector_id": connector_id.value,
            "account_id": account_id,
            "section_filter": {
                "id": section_filter.id,
                "sections": [
                    {"id": section.id, "name": section.name, "type": section.type}
                    for section in section_filter.sections
                ],
            },
        }
        response = requests.post(
            self.api_url + "add-section-filter",
            json=body,
            headers={
                "Authorization": "Bearer " + self.secret_key,
                "Accept": "application/json",
            },
        )
        if response.status_code == 200:
            filter = response.json()["section_filter"]
            filter = SectionFilter(
                id=filter["id"],
                sections=[Section(**section) for section in filter["sections"]],
            )
            return filter
        else:
            self.handle_http_error(response)

    def get_conversations(
        self,
        *,
        account_id: str,
        connector_id: ConnectorId,
        oldest_timestamp: Optional[int] = None,
    ):
        body = {
            "connector_id": connector_id.value,
            "account_id": account_id,
        }
        if oldest_timestamp is not None:
            body["oldest_timestamp"] = oldest_timestamp

        response = requests.post(
            self.api_url + "get-conversations",
            json=body,
            headers={
                "Authorization": "Bearer " + self.secret_key,
                "Accept": "application/json",
            },
        )
        if response.status_code == 200:
            data = response.json()
            messages = data["messages"]
            next_page_cursor = data["next_page_cursor"]
            return GetConversationsResponse(
                messages=messages, next_page_cursor=next_page_cursor
            )

        else:
            self.handle_http_error(response)
