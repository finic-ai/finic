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
)
from models.api import GetDocumentsResponse
from appstatestore.statestore import StateStore
import base64
from .readme_parser import ReadmeParser


class ReadmeConnector(DocumentConnector):
    connector_id: ConnectorId = ConnectorId.readme
    config: AppConfig
    headers: Dict = {}

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize_api_key(
        self, account_id: str, credential: Dict, metadata: Optional[Dict]
    ) -> AuthorizationResult:
        credential_string = json.dumps(credential)

        assert credential["api_key"] is not None

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=credential_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={},
        )

        return AuthorizationResult(authorized=True, connection=new_connection)

    async def authorize(
        self, account_id: str, auth_code: Optional[str], metadata: Optional[Dict]
    ) -> AuthorizationResult:
        pass

    async def get_sections(self, account_id: str) -> List[Section]:
        pass

    async def load(self, connection_filter: ConnectionFilter) -> GetDocumentsResponse:
        account_id = connection_filter.account_id
        uris = connection_filter.uris
        section_filter = connection_filter.section_filter_id

        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )
        credential_string = connection.credential
        credential_json = json.loads(credential_string)
        api_key = credential_json["api_key"]

        parser = ReadmeParser(api_key=api_key)

        all_docs = parser.get_all_docs()

        documents = [
            Document(
                title=doc["title"],
                content=doc["content"],
                connector_id=self.connector_id,
                account_id=account_id,
                uri=doc["uri"],
            )
            for doc in all_docs
        ]

        return GetDocumentsResponse(documents=documents)
