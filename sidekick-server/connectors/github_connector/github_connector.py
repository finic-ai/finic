import requests
import json
from typing import Dict, List, Any
from models.models import Source, AppConfig, Document, DocumentMetadata, DataConnector, AuthorizationResult
from appstatestore.statestore import StateStore
from github import Github
import markdown
from bs4 import BeautifulSoup
import uuid


class GithubConnector(DataConnector):
    source_type: Source = Source.github
    connector_id: int = 9
    config: AppConfig
    repo_name: str
    user: Any = None

    def __init__(self, config: AppConfig, repo_name: str):
        super().__init__(config=config, repo_name=repo_name)

    async def authorize(self, api_key: str, subdomain: str, email: str) -> AuthorizationResult:
        creds = {
            "api_key": api_key,
        }

        try:
            github = Github(login_or_token=api_key)
            user = github.get_user()
            repo_count = user.get_repos().totalCount
        except Exception as e:
            print(e)
            return AuthorizationResult(authorized=False)

        creds_string = json.dumps(creds)
        StateStore().save_credentials(self.config, creds_string, self)
        return AuthorizationResult(authorized=True)

    def get_markdown_text_in_repo(self, repo_name: str):
        markdown_extensions = (".md", ".rst", ".mdx", ".mkd", ".mdwn", ".mdown", ".mdtxt", ".mdtext", ".markdown")
        texts = []
        try:
            repo = self.user.get_repo(repo_name)
            contents = repo.get_contents("")

            while len(contents) > 0:
                file_content = contents.pop(0)
                if file_content.path.lower().endswith(markdown_extensions):
                    file_name = file_content.name
                    url = file_content.html_url
                    markdown_text = file_content.decoded_content.decode('utf-8')
                    html = markdown.markdown(markdown_text)
                    soup = BeautifulSoup(html, features='html.parser')
                    text = soup.get_text()
                    text = text.replace("\n", "")
                    texts.append((text, file_name, url))
                if file_content.type == "dir":
                    contents.extend(repo.get_contents(file_content.path))

        except Exception as e:
            print(e)
        return texts

    async def load(self, source_id: str) -> List[Document]:
        credential_string = StateStore().load_credentials(self.config, self)
        credential_json = json.loads(credential_string)
        api_key = credential_json["api_key"]

        github = Github(login_or_token=api_key)
        user = github.get_user()
        self.user = user

        documents: List[Document] = []
        all_markdown_texts = self.get_markdown_text_in_repo(self.repo_name)
        for doc_data in all_markdown_texts:
            content, file_name, url = doc_data
            documents.append(
                Document(
                    title=file_name,
                    text=content,
                    url=url,
                    source_type=Source.github,
                    metadata=DocumentMetadata(
                        document_id=str(uuid.uuid4()),
                        source_id=source_id,
                        tenant_id=self.config.tenant_id
                    )
                )
            )

        return documents
