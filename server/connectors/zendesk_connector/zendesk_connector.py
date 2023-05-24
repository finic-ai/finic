from models.models import AppConfig, Document, ConnectorId, AuthorizationResult, DataConnector
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
from typing import Dict
import json
import requests
from bs4 import BeautifulSoup


class ZendeskConnector(DataConnector):
    connector_id: ConnectorId = ConnectorId.zendesk
    config: AppConfig

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize_api_key(self, connection_id: str, credential: Dict, metadata: Dict) -> AuthorizationResult:
        credential_string = json.dumps(credential)
        subdomain = metadata['subdomain']

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=credential_string,
            connector_id=self.connector_id,
            connection_id=connection_id,
            metadata={'subdomain': subdomain}
        )

        return AuthorizationResult(authorized=True, connection=new_connection)

    async def authorize(self, connection_id: str, auth_code: Optional[str], metadata: Dict) -> AuthorizationResult:
        pass

    async def load(self, connection_id: str) -> List[Document]:
        # initialize credentials
        connection = StateStore().load_credentials(self.config, self.connector_id, connection_id)
        credential_json = json.loads(connection.credential)
        subdomain = connection.metadata['subdomain']
        api_key = credential_json["api_key"]
        email = credential_json["email"]

        base_url = f"https://{subdomain}.zendesk.com/api/v2/help_center/articles.json"
        auth = (email + "/token", api_key)

        documents = []

        while base_url:
            response = requests.get(base_url, auth=auth)
            if response.status_code != 200:
                print(f"Error: Unable to fetch articles. Status code: {response.status_code}")
                return []

            data = response.json()
            for article in data["articles"]:
                title=article['title']
                article_url = article["html_url"]
                body = article['body']
                text = BeautifulSoup(body, "html.parser").get_text()
                documents.append(
                        Document(
                        title=title,
                        content=text,
                        uri=article_url
                    )
                )
            base_url = data["next_page"]

        return documents