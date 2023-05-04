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
from atlassian import Confluence



class ConfluenceConnector(DataConnector):
    source_type: Source = Source.confluence
    connector_id: int = 6
    config: AppConfig
    space: str

    def __init__(self, config: AppConfig, space: str):
        super().__init__(config=config, space=space)
                        

    async def authorize(self, api_key: str, subdomain: str, email: str) -> AuthorizationResult:
        creds = {
            "api_key": api_key,
            "subdomain": subdomain,
            "email": email
        }

        confluence = Confluence(
            url=f"https://{subdomain}.atlassian.net/wiki",
            username=email,
            password=api_key
        )

        try:
            spaces = confluence.get_all_spaces()
            print(spaces)
            # confluence.get_all_pages_from_space(space="~63c44c031d7734b550c1259d",start=start_at, limit=limit)
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

        confluence = Confluence(
            url=f"https://{subdomain}.atlassian.net/wiki",
            username=email,
            password=api_key
        )

        documents = []

        start_at = 0
        limit = 25
        while True:
            pages = confluence.get_all_pages_from_space(self.space, start=start_at, limit=limit, expand="body.storage")

            if not pages:
                break

            for page in pages:
                title = page["title"]
                content = page["body"]["storage"]["value"]
                url = f"{confluence.url}{page['_links']['webui']}"
                
                documents.append(
                    Document(
                        title=title,
                        text=content,
                        url=url,
                        source_type=Source.confluence,
                        metadata=DocumentMetadata(
                            document_id=str(uuid.uuid4()),
                            source_id=source_id,
                            tenant_id=self.config.tenant_id
                        )
                    )
                )

            start_at += limit

        return documents

       