import requests
import json
from typing import Dict, List
from models.models import Source, AppConfig, Document, DocumentMetadata, DataConnector, AuthorizationResult
from appstatestore.statestore import StateStore
from io import BytesIO
from PyPDF2 import PdfReader
import docx
import uuid

BASE_URL = "https://api.dropboxapi.com"


class DropboxConnector(DataConnector):
    source_type: Source = Source.dropbox
    connector_id: int = 7
    config: AppConfig
    folder_name: str

    def __init__(self, config: AppConfig, folder_name: str):
        super().__init__(config=config, folder_name=folder_name)

    async def authorize(self, api_key: str, subdomain: str, email: str) -> AuthorizationResult:
        creds = {
            "api_key": api_key,
        }

        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        }

        json_data = {
            'query': 'foo',
        }

        try:
            response = requests.post(f'{BASE_URL}/2/check/user', headers=headers, json=json_data)
            print("authorize response", response.status_code)
            if response.status_code != 200:
                print(f"Error: Unable to fetch articles. Status code: {response.status_code}")
                return AuthorizationResult(authorized=False)
        except Exception as e:
            print(e)
            return AuthorizationResult(authorized=False)

        creds_string = json.dumps(creds)
        StateStore().save_credentials(self.config, creds_string, self)
        return AuthorizationResult(authorized=True)

    def get_all_files_under_folder(self, api_key: str, folder_name: str):
        headers = {
            'Authorization': f"Bearer {api_key}",
            'Content-Type': 'application/json',
        }

        json_data = {
            'include_deleted': False,
            'include_has_explicit_shared_members': False,
            'include_media_info': False,
            'include_mounted_folders': True,
            'include_non_downloadable_files': True,
            'path': f"/{folder_name}",
            'recursive': True,
        }

        res = requests.post(f'{BASE_URL}/2/files/list_folder', headers=headers, json=json_data)
        data = res.json()
        files = data.get('entries')

        file_metadata = []
        for doc in files:
            if doc.get('.tag') == "file":
                document_name = doc.get('name')
                file_type = document_name.split('.')[-1]
                if doc.get('is_downloadable'):
                    document_path = doc.get('path_lower')
                    file_metadata.append((document_name, document_path, file_type))

        return file_metadata

    def extract_text_from_document(self, api_key: str, document_path: str, file_type: str):
        path = {"path": document_path}
        path = json.dumps(path)
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Dropbox-API-Arg': path,
        }

        response = requests.post('https://content.dropboxapi.com/2/files/download', headers=headers)
        if response.status_code == 200:
            content = response.content
            if content:
                text = ""
                if file_type == "pdf":
                    bytes_data = BytesIO(content)
                    reader = PdfReader(bytes_data)
                    for num in range(len(reader.pages)):
                        page = reader.pages[num]
                        page_text = page.extract_text()
                        text += page_text

                elif file_type == "docx" or file_type == "doc":
                    bytes_data = BytesIO(content)
                    doc = docx.Document(bytes_data)
                    for p in doc.paragraphs:
                        text += p.text

                elif file_type == "txt":
                    text = content.decode("utf-8")
                return text
        return None



    async def load(self, source_id: str) -> List[Document]:
        credential_string = StateStore().load_credentials(self.config, self)
        credential_json = json.loads(credential_string)
        api_key = credential_json["api_key"]

        documents: List[Document] = []

        files = self.get_all_files_under_folder(api_key, self.folder_name)

        for file_name, file_path, file_type in files:
            text = self.extract_text_from_document(api_key, file_path, file_type)
            if text:
                documents.append(
                    Document(
                        title=file_name,
                        text=text,
                        url=file_path,
                        source_type=Source.dropbox,
                        metadata=DocumentMetadata(
                            document_id=str(uuid.uuid4()),
                            source_id=source_id,
                            tenant_id=self.config.tenant_id
                        )
                    )
                )

        return documents
