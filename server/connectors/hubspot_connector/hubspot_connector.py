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
    ConnectionFilter,
)
from models.api import GetDocumentsResponse
from appstatestore.statestore import StateStore
import base64
from hubspot import HubSpot


class HubspotConnector(DocumentConnector):
    connector_id: ConnectorId = ConnectorId.hubspot
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
            redirect_uri = "https://link.psychic.dev/oauth/redirect"
            scopes = (
                "cms.knowledge_base.articles.read%20cms.knowledge_base.settings.read"
            )
            authorization_url = f"https://app.hubspot.com/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope={scopes}"

            api_client = HubSpot()
        except Exception as e:
            raise Exception("Connector is not enabled")

        if not auth_code:
            return AuthorizationResult(authorized=False, auth_url=authorization_url)

        try:
            tokens = api_client.auth.oauth.tokens_api.create_token(
                grant_type="authorization_code",
                redirect_uri=redirect_uri,
                client_id=client_id,
                client_secret=client_secret,
                code=auth_code,
            )
            creds = {
                "access_token": tokens.access_token,
                "refresh_token": tokens.refresh_token,
                "expires_in": tokens.expires_in,
            }
            creds_string = json.dumps(creds)

            workspace_name = ""

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

    async def get_sections(self) -> List[str]:
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

        documents: List[Document] = [
            Document(
                connector_id=self.connector_id,
                account_id=account_id,
                title="Test",
                content='This is an example help article. You can edit it by clicking the edit button in the top right corner. You can also add new articles by clicking the "Add Article" button in the top left corner.',
                uri="https://www.intercom.com/Help-Article-Example-1d1b1b1b1b1b4c4c4c4c4c4c4c4c4c4c",
            )
        ]

        return GetDocumentsResponse(documents=documents)
