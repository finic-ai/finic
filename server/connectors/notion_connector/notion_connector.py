import requests
import os
import json
from typing import Dict, List, Optional
from models.models import AppConfig, Document, ConnectorId, DocumentConnector, AuthorizationResult
from appstatestore.statestore import StateStore
import base64
from .notion_parser import NotionParser

BASE_URL = "https://api.notion.com"


class NotionConnector(DocumentConnector):
    connector_id: ConnectorId = ConnectorId.notion
    config: AppConfig
    headers: Dict = {}

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize_api_key(self) -> AuthorizationResult:
        pass

    async def authorize(self, account_id: str, auth_code: Optional[str], metadata: Optional[Dict]) -> AuthorizationResult:
        connector_credentials = StateStore().get_connector_credential(self.connector_id, self.config)
        try: 
            client_id = connector_credentials['client_id']
            client_secret = connector_credentials['client_secret']
            authorization_url = connector_credentials['authorization_url']
            redirect_uri = "https://link.psychic.dev/oauth/redirect"
        except Exception as e:
            raise Exception("Connector is not enabled")
        
        if not auth_code:
            return AuthorizationResult(authorized=False, auth_url=authorization_url)

        try:
            # encode in base 64
            encoded = base64.b64encode(f"{client_id}:{client_secret}".encode("utf-8")).decode("utf-8")
            headers = {
                "Authorization": f"Basic {encoded}", 
                "Content-Type": "application/json", 
                "Notion-Version": "2022-06-28"
            }

            data = {
                'code': auth_code,
                'grant_type': 'authorization_code',
                'redirect_uri': redirect_uri
            }

            response = requests.post(f"{BASE_URL}/v1/oauth/token", headers=headers, json=data)

            creds = response.json()

            creds_string = json.dumps(creds)
            workspace_name = creds['workspace_name']
            
            
        except Exception as e:
            print(e)
            raise Exception("Unable to get access token with code")

        
        new_connection = StateStore().add_connection(
            config=self.config,
            credential=creds_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={
                'workspace_name': workspace_name,
            }
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    def get_page_text(self, page_id: str):
        page_text = []
        blocks = self.notion_get_blocks(page_id)
        for item in blocks['results']:
            item_type = item.get('type')
            content = item.get(item_type)
            if content.get('rich_text'):
                for text in content.get('rich_text'):
                    plain_text = text.get('plain_text')
                    page_text.append(plain_text)
        print(json.dumps(blocks))
        print(page_text)
        return page_text

    async def load(self, account_id: str) -> List[Document]:
        connection = StateStore().load_credentials(self.config, self.connector_id, account_id)
        credential_string = connection.credential
        credential_json = json.loads(credential_string)
        access_token = credential_json["access_token"]

        parser = NotionParser(access_token)

        all_notion_documents = parser.notion_search({})

        documents: List[Document] = []
        for item in all_notion_documents:
            object_type = item.get('object')
            object_id = item.get('id')
            url = item.get('url')
            title = ""

            if object_type == 'page':
                title = parser.parse_title(item)
                blocks = parser.notion_get_blocks(object_id)
                html = parser.parse_notion_blocks(blocks)
                html = f"<div><h1>{title}</h1>{html}</div>"
                documents.append(
                    Document(
                        title=title,
                        content=html,
                        uri=url
                    )
                )
        return documents





            

    
