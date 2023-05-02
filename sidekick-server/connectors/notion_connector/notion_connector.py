import requests
import os
import json
from typing import Dict, List, Optional
from models.models import AppConfig, Document, ConnectorId, DataConnector, AuthorizationResult
from appstatestore.statestore import StateStore
import base64

BASE_URL = "https://api.notion.com"


class NotionConnector(DataConnector):
    connector_id: ConnectorId = ConnectorId.notion
    config: AppConfig
    headers: Dict = {}
    connector_credentials: Dict = {}

    def __init__(self, config: AppConfig):
        super().__init__(config=config)
        self.connector_credentials = StateStore().get_connector_credential(self.connector_id, config)

    async def authorize(self, connection_id: str, auth_code: Optional[str]) -> AuthorizationResult:
        try: 
            client_id = self.connector_credentials['client_id']
            client_secret = self.connector_credentials['client_secret']
            authorization_url = self.connector_credentials['authorization_url']
            redirect_uri = self.connector_credentials['redirect_uri']
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
            connection_id=connection_id,
            metadata={
                'workspace_name': workspace_name,
            }
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    def notion_get_blocks(self, page_id: str):
        res = requests.get(f"{BASE_URL}/v1/blocks/{page_id}/children?page_size=100", headers=self.headers)
        return res.json()

    def notion_search(self, query: Dict):
        res = requests.post(f"{BASE_URL}/v1/search", headers=self.headers, data=query)
        return res.json()

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
        return page_text

    async def load(self, connection_id: str) -> List[Document]:
        credential_string = StateStore().load_credentials(self.config, self.connector_id, connection_id)
        credential_json = json.loads(credential_string)
        access_token = credential_json["access_token"]
        self.headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json",
                        "Notion-Version": "2022-06-28"}

        documents: List[Document] = []
        all_notion_documents = self.notion_search({})
        items = all_notion_documents.get('results')
        for item in items:
            object_type = item.get('object')
            object_id = item.get('id')
            url = item.get('url')
            title = ""
            page_text = []

            if object_type == 'page':
                title_content = item.get('properties').get('title')
                if title_content:
                    title = title_content.get('title')[0].get('text').get('content')
                elif item.get('properties').get('Name'):
                    if len(item.get('properties').get('Name').get('title')) > 0:
                        title = item.get('properties').get('Name').get('title')[0].get('text').get('content')

                page_text.append([title])
                page_content = self.get_page_text(object_id)
                page_text.append(page_content)

                flat_list = [item for sublist in page_text for item in sublist]
                text_per_page = ". ".join(flat_list)
                if len(text_per_page) > 0:
                    documents.append(
                        Document(
                            title=title,
                            content=text_per_page,
                            uri=url
                        )
                    )

        return documents
