from models.models import Source, AppConfig, Document, DocumentMetadata, AuthorizationResult, DataConnector
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
from typing import Any
import json
import requests
from bs4 import BeautifulSoup


class ZendeskConnector(DataConnector):
    source_type: Source = Source.zendesk
    connector_id: int = 5
    config: AppConfig
    folder_name: str
    flow: Optional[Any] = None

    def __init__(self, config: AppConfig, folder_name: str):
        super().__init__(config=config, folder_name=folder_name)
                        

    async def authorize(self, api_key: str, subdomain: str, email: str) -> AuthorizationResult:
        creds = {
            "api_key": api_key,
            "subdomain": subdomain,
            "email": email
        }
        base_url = f"https://{subdomain}.zendesk.com/api/v2/help_center/articles.json"
        auth = (email + "/token", api_key)
        try:
            response = requests.get(base_url, auth=auth)
            if response.status_code != 200:
                print(f"Error: Unable to fetch articles. Status code: {response.status_code}")
                return AuthorizationResult(authorized=False)
        except Exception as e:
            print(e)
            return AuthorizationResult(authorized=False)

        creds_string = json.dumps(creds)
        StateStore().save_credentials(self.config, creds_string, self)
        return AuthorizationResult(authorized=True)

    async def load(self, source_id: str) -> List[Document]:
        # initialize credentials
        credential_string = StateStore().load_credentials(self.config, self)
        credential_json = json.loads(credential_string)
        api_key = credential_json["api_key"]
        subdomain = credential_json["subdomain"]
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
                        text=text,
                        url=article_url,
                        source_type=Source.zendesk,
                        metadata=DocumentMetadata(
                            document_id=str(uuid.uuid4()),
                            source_id=source_id,
                            tenant_id=self.config.tenant_id
                        )
                    )
                )
            base_url = data["next_page"]

        return documents