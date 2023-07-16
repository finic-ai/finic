import base64
import json
from typing import Dict, List, Any, Optional
from models.models import (
    ConnectionFilter,
    ConnectorId,
    Document,
    DocumentConnector,
    AppConfig,
    AuthorizationResult,
    GetDocumentsResponse,
)
from requests_oauthlib import OAuth2Session
from appstatestore.statestore import StateStore
from github import Auth, Github

authorization_base_url = "https://github.com/login/oauth/authorize"
token_url = "https://github.com/login/oauth/access_token"


class GithubConnector(DocumentConnector):
    connector_id: ConnectorId = ConnectorId.github
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
            github_session = OAuth2Session(client_id)
            authorization_url, _ = github_session.authorization_url(
                authorization_base_url
            )
        except Exception as e:
            raise Exception("Connector is not enabled")

        if not auth_code:
            return AuthorizationResult(authorized=False, auth_url=authorization_url)
        pass

        try:
            github = OAuth2Session(client_id)
            token = github.fetch_token(
                token_url, client_secret=client_secret, authorization_response=auth_code
            )

            creds_string = json.dumps(token)

        except Exception as e:
            print(e)
            raise Exception("Unable to get access token with code")

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=creds_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={},
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    async def get_sections(self) -> List[str]:
        pass

    async def load(self, connection_filter: ConnectionFilter) -> GetDocumentsResponse:
        account_id = connection_filter.account_id
        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )
        credential_string = connection.credential
        credential_json = json.loads(credential_string)

        access_token = credential_json.get("access_token")

        auth = Auth.Token(access_token)
        g = Github(auth=auth, per_page=1)

        if not connection_filter.page_cursor:
            page_cursor = 0
        else:
            page_cursor = int(connection_filter.page_cursor)

        code_files = []
        try:
            repos = g.get_user().get_repos()
            max_page_cursor = repos.totalCount
            if page_cursor >= max_page_cursor:
                raise Exception("Invalid page cursor")

            for repo in repos.get_page(page_cursor):
                contents = repo.get_contents("")
                while contents:
                    file_content = contents.pop(0)
                    if file_content.type == "dir":
                        contents.extend(repo.get_contents(file_content.path))
                    else:
                        code_files.append(file_content)
        except Exception as e:
            print(e)

        documents = []
        for file in code_files:
            try:
                decoded_content = base64.b64decode(file.content).decode()
            except Exception as e:
                print("{} is not decodable as a string - ignoring".format(file))
                continue

            documents.append(
                Document(
                    title=file.name,
                    content=decoded_content,
                    connector_id=self.connector_id,
                    account_id=access_token,
                    uri=file.html_url,
                )
            )

        if page_cursor + 1 == max_page_cursor:
            next_page_cursor = None
        else:
            next_page_cursor = page_cursor + 1

        return GetDocumentsResponse(
            documents=documents, next_page_cursor=next_page_cursor
        )
