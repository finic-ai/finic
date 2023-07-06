from models.models import (
    ConnectorId,
    AppConfig,
    Document,
    AuthorizationResult,
    DocumentConnector,
    ConnectionFilter,
)
from models.api import GetDocumentsResponse
from typing import List, Optional, Dict
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
from atlassian.confluence import Confluence


class ConfluenceConnector(DocumentConnector):
    connector_id: ConnectorId = ConnectorId.confluence
    config: AppConfig

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
            authorization_url = connector_credentials["authorization_url"]
            redirect_uri = "https://link.psychic.dev/oauth/redirect"
        except Exception as e:
            raise Exception("Connector is not enabled")

        if not auth_code:
            return AuthorizationResult(authorized=False, auth_url=authorization_url)

        try:
            # encode in base 64
            headers = {
                "Content-Type": "application/json",
            }

            data = {
                "code": auth_code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
                "client_id": client_id,
                "client_secret": client_secret,
            }

            response = requests.post(
                "https://auth.atlassian.com/oauth/token", headers=headers, json=data
            )

            creds = response.json()

            print(creds)

            creds_string = json.dumps(creds)

            authorized_site = requests.get(
                "https://api.atlassian.com/oauth/token/accessible-resources",
                headers={
                    "Authorization": "Bearer " + creds["access_token"],
                    "Accept": "application/json",
                },
            ).json()[0]

        except Exception as e:
            print(e)
            raise Exception("Unable to get access token with code")

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=creds_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={"subdomain": authorized_site["url"]},
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    async def get_sections(self) -> List[str]:
        pass

    async def load(self, connection_filter: ConnectionFilter) -> GetDocumentsResponse:
        account_id = connection_filter.account_id
        uris = connection_filter.uris
        section_filter = connection_filter.section_filter_id
        # initialize credentials
        connector_credentials = StateStore().get_connector_credential(
            self.connector_id, self.config
        )
        client_id = connector_credentials["client_id"]
        client_secret = connector_credentials["client_secret"]

        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )
        credential_string = connection.credential
        credential_json = json.loads(credential_string)

        access_token = credential_json["access_token"]
        refresh_token = credential_json["refresh_token"]

        try:
            authorized_site = requests.get(
                "https://api.atlassian.com/oauth/token/accessible-resources",
                headers={
                    "Authorization": "Bearer " + access_token,
                    "Accept": "application/json",
                },
            ).json()[0]

        except Exception as e:
            # Handle expired access token
            print(e)

            headers = {
                "Content-Type": "application/json",
            }

            data = {
                "refresh_token": refresh_token,
                "grant_type": "refresh_token",
                "client_id": client_id,
                "client_secret": client_secret,
            }

            response = requests.post(
                "https://auth.atlassian.com/oauth/token", headers=headers, json=data
            )

            creds = response.json()

            access_token = creds["access_token"]

            creds_string = json.dumps(creds)

            StateStore().add_connection(
                config=connection.config,
                credential=creds_string,
                connector_id=self.connector_id,
                account_id=account_id,
                metadata={},
            )

            authorized_site = requests.get(
                "https://api.atlassian.com/oauth/token/accessible-resources",
                headers={
                    "Authorization": "Bearer " + access_token,
                    "Accept": "application/json",
                },
            ).json()[0]

        cloud_id = authorized_site["id"]
        confluence_url = authorized_site["url"]

        spaces = requests.get(
            f"https://api.atlassian.com/ex/confluence/{cloud_id}/rest/api/space",
            headers={
                "Authorization": "Bearer " + access_token,
                "Accept": "application/json",
            },
        ).json()

        space = spaces["results"][0]["key"]

        documents = []

        for space in spaces["results"]:
            start_at = 0
            limit = 25
            space_key = space["key"]
            while True:
                pages_response = requests.get(
                    f"https://api.atlassian.com/ex/confluence/{cloud_id}/wiki/rest/api/content?spaceKey={space_key}&limit=25&start={start_at}&expand=body.storage&type=page",
                    headers={
                        "Authorization": "Bearer " + access_token,
                        "Accept": "application/json",
                    },
                )

                pages = pages_response.json()["results"]

                # pages = confluence.get_all_pages_from_space(space, start=start_at, limit=limit, expand="body.storage")

                if not pages:
                    break

                for page in pages:
                    title = page["title"]
                    content = page["body"]["storage"]["value"]
                    url = f"{confluence_url}/wiki{page['_links']['webui']}"

                    content = BeautifulSoup(content, "html.parser").get_text()

                    documents.append(
                        Document(
                            title=title,
                            content=content,
                            connector_id=self.connector_id,
                            account_id=account_id,
                            uri=url,
                        )
                    )

                start_at += limit

        return GetDocumentsResponse(documents=documents)
