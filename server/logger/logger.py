import os
import posthog
from typing import Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel
from models.models import AppConfig

# Enum of logging events
class Event(str, Enum):
    set_custom_connector_credentials = "set_custom_connector_credentials"
    get_connector_status = "get_connector_status"
    get_connections = "get_connections"
    add_apikey_connection = "log_add_apikey_connection"
    add_oauth_connection = "add_oauth_connection"
    get_documents = "get_documents"
    run_sync = "run_sync"
    get_conversations = "get_conversations"

class Logger:
    posthog_client: Optional[posthog.Client] = None

    def __init__(self):
        # set up posthog logger
        api_key = os.environ.get('POSTHOG_API_KEY')
        host = os.environ.get('POSTHOG_HOST')
        if api_key is not None and host is not None: 
            self.posthog_client = posthog.Client(
                api_key=os.environ.get('POSTHOG_API_KEY'),
                host=os.environ.get('POSTHOG_HOST')
            )

    def log(self, app_config: AppConfig, event: str, properties: Dict[str, Any]):
        if self.posthog_client is not None:
            print("logging event: ", event, " with properties: ", properties)
            self.posthog_client.capture(distinct_id=app_config.user_id, event=event, properties=properties)

    def log_api_call(self, app_config: AppConfig, event: str, request: BaseModel, response: BaseModel, error: bool):
        if self.posthog_client is None:
            return
        if event not in Event.__members__.values():
            raise Exception("Invalid event type")
        properties = {
            'app_id': app_config.app_id,
            'request': request.dict(),
            'response': response.dict(),
            'error': error
        }
        self.log(app_config=app_config, event="server_" + event, properties=properties)