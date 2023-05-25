import os
import posthog
from typing import Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel
from models.models import AppConfig
from models.api import (
    AuthorizationResponse,
    AuthorizeOauthRequest,
    EnableConnectorRequest,
    ConnectorStatusRequest,
    ConnectorStatusResponse,
    GetDocumentsRequest,
    GetDocumentsResponse,
    AuthorizeApiKeyRequest,
    GetConnectionsRequest,
    GetConnectionsResponse,
    RunSyncRequest,
    RunSyncResponse,
)

# Enum of logging events
class Event(str, Enum):
    set_custom_connector_credentials = "set_custom_connector_credentials"
    get_connector_status = "get_connector_status"
    get_connections = "log_get_connections"
    add_apikey_connection = "log_add_apikey_connection"
    add_oauth_connection = "add_oauth_connection"
    get_documents = "get_documents"
    run_sync = "run_sync"

class Logger:
    posthog_client: Optional[posthog.Client] = None

    def __init__(self):
        # set up posthog logger
        self.posthog_client = posthog.Client(
            api_key=os.environ.get('POSTHOG_API_KEY'),
            host=os.environ.get('POSTHOG_HOST')
        )

    def log(self, app_config: AppConfig, event: str, properties: Dict[str, Any]):
        if self.posthog_client is not None:
            print("logging event: ", event, " with properties: ", properties)
            self.posthog_client.capture(distinct_id=app_config.user_id, event=event, properties=properties)

    def log_api_call(self, app_config: AppConfig, event: str, request: BaseModel, response: BaseModel, error: bool):
        if event not in Event.__members__.values():
            raise Exception("Invalid event type")
        properties = {
            'app_id': app_config.app_id,
            'request': request.dict(),
            'response': response.dict(),
            'error': error
        }
        self.log(app_config=app_config, event="server_" + event, properties=properties)