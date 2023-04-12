import requests
import os
import json
from typing import Dict, List
from models.models import Source, AppConfig, Document, DocumentMetadata, DataConnector, AuthorizationResult
from appstatestore.statestore import StateStore

BASE_URL = "https://api.notion.com"


class NotionConnector(DataConnector):
    source_type: Source = Source.notion
    connector_id: int = 4
    config: AppConfig
    headers: Dict = {}

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize(self, api_key: str, subdomain: str, email: str) -> AuthorizationResult:
        creds = {
            "api_key": api_key,
        }
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json", "Notion-Version": "2022-06-28"}

        try:
            response = requests.post(f"{BASE_URL}/v1/search", headers=headers, data={})
            if response.status_code != 200:
                print(f"Error: Unable to fetch articles. Status code: {response.status_code}")
                return AuthorizationResult(authorized=False)
        except Exception as e:
            print(e)
            return AuthorizationResult(authorized=False)

        creds_string = json.dumps(creds)
        StateStore().save_credentials(self.config, creds_string, self)
        return AuthorizationResult(authorized=True)

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

    async def load(self, source_id: str) -> List[Document]:
        credential_string = StateStore().load_credentials(self.config, self)
        credential_json = json.loads(credential_string)
        api_key = credential_json["api_key"]
        self.headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json",
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
                            text=text_per_page,
                            url=url,
                            source_type=Source.notion,
                            metadata=DocumentMetadata(
                                document_id=object_id,
                                source_id=source_id,
                                tenant_id=self.config.tenant_id
                            )
                        )
                    )

        return documents
