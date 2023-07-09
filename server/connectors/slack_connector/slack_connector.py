import json
from typing import Dict, List, Optional
from models.api import GetConversationsResponse
from models.models import (
    AppConfig,
    Message,
    ConnectorId,
    ConversationConnector,
    AuthorizationResult,
)
from appstatestore.statestore import StateStore
from slack_sdk.web import WebClient
import time
from .slack_parser import SlackParser


BASE_URL = "https://api.notion.com"


class SlackConnector(ConversationConnector):
    connector_id: ConnectorId = ConnectorId.slack
    config: AppConfig
    headers: Dict = {}

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
            client = WebClient()
            oauth_response = client.oauth_v2_access(
                client_id=client_id,
                client_secret=client_secret,
                code=auth_code,
                redirect_uri=redirect_uri,
            )
            oauth_data = oauth_response.data
            team = oauth_data.get("team")
            if team:
                team_name = team.get("name")
            else:
                team_name = ""

            access_token = oauth_data.get("access_token")

            if not access_token:
                raise Exception("Unable to get access token with code")

            creds_string = json.dumps(oauth_data)

        except Exception as e:
            print(e)
            raise Exception("Unable to get access token with code")

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=creds_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={
                "team_name": team_name,
            },
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    async def get_sections(self) -> List[str]:
        pass

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
        access_token = credential_json["access_token"]
        resulting_messages: List[Message] = []
        parser = SlackParser(access_token=access_token)
        client = WebClient(token=access_token)

        if not oldest_message_timestamp:
            # oldest message is 24 hours ago
            oldest = str(int(time.time()) - 24 * 60 * 60)
        else:
            oldest = oldest_message_timestamp

        try:
            # Fetch all channels in the workspace with pagination
            cursor = None
            channels = []

            while True:
                response = client.conversations_list(cursor=cursor)
                channels.extend(response["channels"])

                cursor = response.get("response_metadata", {}).get("next_cursor")
                if not cursor:
                    break

            # Filter for channels where the bot is a member
            bot_channels = [channel for channel in channels if channel["is_member"]]

            for channel in bot_channels:
                # Fetch the message history for each channel with pagination
                cursor = None
                messages = []
                while True:
                    response = client.conversations_history(
                        channel=channel["id"],
                        oldest=oldest,
                        cursor=cursor,
                    )
                    messages.extend(response["messages"])

                    cursor = response.get("response_metadata", {}).get("next_cursor")
                    if not cursor:
                        break

                for message in messages:
                    msgs = parser.parse_message(message, channel)
                    resulting_messages.extend(msgs)

            return GetConversationsResponse(messages=resulting_messages)

        except Exception as e:
            raise Exception(f"Unable to load messages from Slack due to error: {e}")
