from models.models import AppConfig, Document, ConnectorId, AuthorizationResult, DataConnector
from typing import List, Optional
from urllib.parse import urlencode, urlunparse, urlparse, ParseResult
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

    async def authorize_api_key(self, account_id: str, credential: Dict, metadata: Dict) -> AuthorizationResult:
        credential_string = json.dumps(credential)
        subdomain = metadata['subdomain']

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=credential_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={'subdomain': subdomain}
        )

        return AuthorizationResult(authorized=True, connection=new_connection)

    async def authorize(self, account_id: str, auth_code: Optional[str], metadata: Dict) -> AuthorizationResult:
        connector_credentials = StateStore().get_connector_credential(self.connector_id, self.config)
        try: 
            client_id = connector_credentials['client_id']
            client_secret = connector_credentials['client_secret']
            subdomain = connector_credentials['subdomain']
            redirect_uri = "https://link.psychic.dev/oauth/redirect"
        except Exception as e:
            raise Exception("Connector is not enabled")
        
        if not auth_code:
            auth_url = f"https://{subdomain}.zendesk.com/oauth/authorizations/new"
            scopes = "hc:read tickets:read"
            params = {
                'response_type': 'code',
                'redirect_uri': redirect_uri,
                'client_id': client_id,
                'scope': scopes
            }
            encoded_params = urlencode(params)
            url_parts = urlparse(auth_url)
            auth_url = ParseResult(
                scheme=url_parts.scheme,
                netloc=url_parts.netloc,
                path=url_parts.path,
                params=url_parts.params,
                query=encoded_params,
                fragment=url_parts.fragment
            ).geturl()
            return AuthorizationResult(authorized=False, auth_url=auth_url)

        try:
            # encode in base 64
            headers = {
                "Content-Type": "application/json", 
            }

            data = {
                'code': auth_code,
                'grant_type': 'authorization_code',
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': redirect_uri,
                'scope': 'hc:read tickets:read'
            }

            response = requests.post(f"https://{subdomain}.zendesk.com/oauth/tokens", headers=headers, json=data)

            creds = response.json()
            creds_string = json.dumps(creds)
            
        except Exception as e:
            print(e)
            raise Exception("Unable to get access token with code")

        
        new_connection = StateStore().add_connection(
            config=self.config,
            credential=creds_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata=metadata
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    async def load(self, account_id: str) -> List[Document]:
        # initialize credentials
        connection = StateStore().load_credentials(self.config, self.connector_id, account_id)
        credential_json = json.loads(connection.credential)

        subdomain = connection.metadata['subdomain']

        is_oauth = False
        if "api_key" in credential_json:
            api_key = credential_json["api_key"]
            email = credential_json["email"]
        else:
            is_oauth = True
            access_token = credential_json["access_token"]

        base_url = f"https://{subdomain}.zendesk.com/api/v2/help_center/articles.json"

        documents = []

        while base_url:
            if is_oauth:
                response = self.call_zendesk_api_oauth(base_url, access_token)
            else:
                response = self.call_zendesk_api(base_url, api_key, email)
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
    
    def call_zendesk_api_oauth(self, url, access_token):
        response = requests.get(url, headers={"Authorization": f"Bearer {access_token}"})
        return response 
    
    def call_zendesk_api(self, url, api_key, email):
        response = requests.get(url, auth=(email + "/token", api_key))
        return response