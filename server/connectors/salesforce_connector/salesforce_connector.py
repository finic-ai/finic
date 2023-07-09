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
)
from models.api import GetDocumentsResponse
from requests_oauthlib import OAuth2Session
from appstatestore.statestore import StateStore
import base64


authorization_base_url = "https://login.salesforce.com/services/oauth2/authorize"
token_url = "https://login.salesforce.com/services/oauth2/token"


class SalesforceConnector(DocumentConnector):
    connector_id: ConnectorId = ConnectorId.salesforce
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
            sfdc = OAuth2Session(client_id, redirect_uri=redirect_uri)
            authorization_url, _ = sfdc.authorization_url(authorization_base_url)
        except Exception as e:
            raise Exception("Connector is not enabled")

        if not auth_code:
            return AuthorizationResult(authorized=False, auth_url=authorization_url)

        try:
            sfdc = OAuth2Session(client_id, redirect_uri=redirect_uri)
            token = sfdc.fetch_token(
                token_url, client_secret=client_secret, authorization_response=auth_code
            )

            creds_string = json.dumps(token)

        except Exception as e:
            print(e)
            raise Exception("Unable to get access token with code")

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=creds_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={},
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    async def get_sections(self) -> List[str]:
        pass

    async def load(self, account_id: str) -> GetDocumentsResponse:
        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )
        credential_string = connection.credential
        credential_json = json.loads(credential_string)

        documents: List[Document] = [
            {
                "title": "Test",
                "content": 'This is an example help article. You can edit it by clicking the edit button in the top right corner. You can also add new articles by clicking the "Add Article" button in the top left corner.',
                "uri": "https://www.intercom.com/Help-Article-Example-1d1b1b1b1b1b4c4c4c4c4c4c4c4c4c4c",
            }
        ]

        return GetDocumentsResponse(documents=documents)
