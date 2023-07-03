import base64
import yaml
from appstatestore.statestore import StateStore
from models.models import (
    AuthorizationResult,
    ConnectionFilter,
    Document,
    DocumentConnector,
    GetDocumentsResponse,
)
from models.models import (
    AppConfig,
    ConnectorId,
    DocumentConnector,
    AuthorizationResult,
    Section,
)
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from typing import List, Dict, Optional, Tuple
import json

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]


class GmailConnector(DocumentConnector):
    connector_id = ConnectorId.gmail
    config: AppConfig

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize_api_key(self) -> AuthorizationResult:
        pass

    async def authorize(
        self, account_id: str, auth_code: Optional[str], metadata: Dict
    ) -> AuthorizationResult:
        cred = StateStore().get_connector_credential(self.connector_id, self.config)
        client_secrets = cred["client_secrets"]
        developer_key = cred["developer_key"]

        redirect_uri = client_secrets["web"]["redirect_uris"][0]

        flow = InstalledAppFlow.from_client_config(
            client_secrets, SCOPES, redirect_uri=redirect_uri
        )

        if not auth_code:
            auth_url, _ = flow.authorization_url(prompt="consent")
            return AuthorizationResult(authorized=False, auth_url=auth_url)

        flow.fetch_token(code=auth_code)
        creds = flow.credentials
        creds_string = creds.to_json()

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=creds_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={},
        )
        new_connection.credential = json.dumps(
            {
                "access_token": creds.token,
                "client_id": creds.client_id,
                "developer_key": developer_key,
            }
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    async def get_sections(self) -> List[Section]:
        pass

    def _get_message_ids(self, service) -> Tuple[List[str], Optional[str]]:
        msg_ids = []

        result = service.users().messages().list(userId="me", maxResults=100).execute()
        if "messages" in result:
            for message in result["messages"]:
                msg_ids.append(message["id"])
        if "nextPageToken" in result:
            return msg_ids, result["nextPageToken"]
        else:
            return msg_ids, None

    def _get_message(self, service, msg_id: str) -> Dict:
        try:
            msg = (
                service.users()
                .messages()
                .get(userId="me", id=msg_id, format="full")
                .execute()
            )
            payload = msg.get("payload")
            headers = payload.get("headers")

            formatted_msg = {}

            # Append metadata like email sender, recipient, subject and time
            if headers:
                for header in headers:
                    name = header.get("name")
                    value = header.get("value")
                    if name.lower() == "from":
                        formatted_msg["from"] = value
                    elif name.lower() == "to":
                        formatted_msg["to"] = value
                    elif name.lower() == "subject":
                        formatted_msg["subject"] = value
                    elif name.lower() == "date":
                        formatted_msg["date"] = value

            # Append email content
            parts = payload.get("parts")
            formatted_msg["content"] = ""
            for part in parts:
                mimeType = part.get("mimeType")
                body = part.get("body")
                # TODO handle downloading attachments
                if mimeType == "text/plain":
                    data = body.get("data")
                    if data:
                        padding = 4 - (len(data) % 4)
                        data = str(data) + "=" * padding
                        formatted_msg["content"] += str(base64.urlsafe_b64decode(data))

            return formatted_msg
        except Exception as e:
            print(e)
            return None

    def _get_messages(self, service, msg_ids: List[str]) -> List[Dict]:
        return [self._get_message(service, msg_id) for msg_id in msg_ids]

    def _map_message_to_document(self, msg: Dict, account_id: str) -> Document:
        content = yaml.dump(msg)
        return Document(
            title=msg["subject"],
            content=content,
            connector_id=self.connector_id,
            account_id=account_id,
        )

    async def load(self, connection_filter: ConnectionFilter) -> GetDocumentsResponse:
        account_id = connection_filter.account_id
        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )

        credential_string = connection.credential

        credential_json = json.loads(credential_string)
        creds = Credentials.from_authorized_user_info(credential_json)

        if not creds.valid and creds.refresh_token:
            creds.refresh(Request())
            creds_string = creds.to_json()
            StateStore().add_connection(
                config=connection.config,
                credential=creds_string,
                connector_id=self.connector_id,
                account_id=account_id,
                metadata={},
            )

        service = build("gmail", "v1", credentials=creds)

        msg_ids, next_page_token = self._get_message_ids(service)
        msgs = self._get_messages(service, msg_ids)

        documents = [self._map_message_to_document(msg, account_id) for msg in msgs]

        return GetDocumentsResponse(
            documents=documents, next_page_cursor=next_page_token
        )
