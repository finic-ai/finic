import base64
import time
from datetime import datetime
from models.api import GetConversationsResponse
from appstatestore.statestore import StateStore
from models.models import (
    AuthorizationResult,
    ConversationConnector,
    AppConfig,
    ConnectorId,
    AuthorizationResult,
    Message,
    MessageRecipient,
    MessageSender,
    Section,
)
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from typing import List, Dict, Optional, Tuple
import json
import re
import yaml

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

# Matches regex of the form "On Sat, Jul 8, 2023 at 10:13 AM Foo Bar <foo.bar@email.com> wrote:"
# This is usually the first line indicating the following text is quoted
EMAIL_QUOTE_START_PATTERN = r"On (Mon|Tue|Wed|Thu|Fri|Sat|Sun), [A-Z][a-z]{2} \d{1,2}, \d{4} at \d{1,2}:\d{2} [AP]M [A-Za-z0-9 ]* <[\w.-]+@[\w.-]+> wrote:"


class GmailConnector(ConversationConnector):
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

    def _get_thread_ids(
        self, service, page_cursor, oldest_message_time
    ) -> Tuple[List[str], Optional[str]]:
        thread_ids = []

        result = (
            service.users()
            .threads()
            .list(
                userId="me",
                maxResults=100,
                pageToken=page_cursor,
                q="after: {}".format(oldest_message_time),
            )
            .execute()
        )
        if "threads" in result:
            for thread in result["threads"]:
                thread_ids.append(thread["id"])
        if "nextPageToken" in result:
            return thread_ids, result["nextPageToken"]
        else:
            return thread_ids, None

    def _get_email_from_thread(self, service, thread_id: str) -> Message:
        thread = (
            service.users()
            .threads()
            .get(userId="me", id=thread_id, format="full")
            .execute()
        )
        msgs = thread.get("messages")
        first_msg = msgs[0]

        replies = []

        # find and parse all replies to the first email first, since to create the final message we need the replies parsed
        for msg in msgs:
            if msg == first_msg:
                continue

            try:
                replies.append(self._parse_message(msg))
            except Exception as e:
                print(e)
                continue

        first_email = self._parse_message(first_msg, replies)
        return first_email

    def _parse_message(
        self, msg: Dict, replies: Optional[List[Message]] = []
    ) -> Message:
        payload = msg.get("payload")
        headers = payload.get("headers")

        # only need ID if this is the first message in the thread. if it has replies, ignore id
        id = None
        if replies:
            id = msg.get("id")

        sender = None
        recipients = []
        subject = ""
        email_content = ""
        timestamp = ""

        # Append metadata like email sender, recipient, subject and time
        if headers:
            for header in headers:
                name = header.get("name")
                value = header.get("value")
                if name.lower() == "from":
                    sender = MessageSender(id=value)
                elif name.lower() == "to":
                    # str is of the form "a@abc.com, b@def.com"
                    emails = value.split(", ")
                    recipients = [MessageRecipient(id=email) for email in emails]
                elif name.lower() == "subject":
                    subject = value
                elif name.lower() == "date":
                    # gmail dates can be either in GMT, or with UTC and timezone, or with just timezone
                    gmt_pattern = r" GMT$"
                    utc_pattern = r" \(UTC\)$"
                    if re.search(gmt_pattern, value):
                        timestamp = time.mktime(
                            datetime.strptime(
                                value, "%a, %d %b %Y %H:%M:%S GMT"
                            ).timetuple()
                        )
                    elif re.search(utc_pattern, value):
                        timestamp = time.mktime(
                            datetime.strptime(
                                value, "%a, %d %b %Y %H:%M:%S %z (UTC)"
                            ).timetuple()
                        )
                    else:
                        timestamp = time.mktime(
                            datetime.strptime(
                                value, "%a, %d %b %Y %H:%M:%S %z"
                            ).timetuple()
                        )

        parts = payload.get("parts")
        for part in parts:
            mimeType = part.get("mimeType")
            body = part.get("body")
            # TODO handle downloading attachments
            if mimeType == "text/plain":
                data = body.get("data")
                if data:
                    padding = 4 - (len(data) % 4)
                    data = str(data) + "=" * padding
                    decoded_content = base64.urlsafe_b64decode(data).decode("utf-8")
                    # Gmail adds replies to the content, we need to manually remove it
                    match = re.search(EMAIL_QUOTE_START_PATTERN, decoded_content)
                    if match:
                        email_content = decoded_content[: match.start()]
                    else:
                        email_content = decoded_content

        content = {
            "subject": subject,
            "sender": sender.dict(exclude_none=True),
            "recipients": [
                recipient.dict(exclude_none=True) for recipient in recipients
            ],
            "timestamp": timestamp,
            "email_content": email_content,
            "replies": [reply.dict(exclude_none=True) for reply in replies],
        }
        return Message(
            id=id,
            content=yaml.dump(
                content,
                sort_keys=False,
                default_style=None,
                default_flow_style=False,
            ),
        )

    async def load_messages(
        self,
        account_id: str,
        oldest_message_timestamp: Optional[str] = None,
        page_cursor: Optional[str] = None,
    ) -> GetConversationsResponse:
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

        if not oldest_message_timestamp:
            # oldest message is 24 hours ago
            oldest = str(int(time.time()) - 24 * 60 * 60)
        else:
            oldest = oldest_message_timestamp

        thread_ids, next_page_cursor = self._get_thread_ids(
            service, page_cursor, oldest
        )
        emails = [
            self._get_email_from_thread(service, thread_id) for thread_id in thread_ids
        ]

        return GetConversationsResponse(messages=emails, page_cursor=next_page_cursor)
