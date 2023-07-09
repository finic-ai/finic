import os
import posthog
from typing import Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel
from models.models import AppConfig, Connection, ConnectorStatus


# Enum of logging events
class Event(str, Enum):
    set_custom_connector_credentials = "set_custom_connector_credentials"
    get_connector_status = "get_connector_status"
    get_connections = "get_connections"
    delete_connection = "delete_connection"
    add_apikey_connection = "log_add_apikey_connection"
    add_oauth_connection = "add_oauth_connection"
    get_documents = "get_documents"
    get_tickets = "get_tickets"
    run_sync = "run_sync"
    get_conversations = "get_conversations"
    ask_question = "ask_question"
    get_link_settings = "get_link_settings"
    add_section_filter = "add_section_filter"
    update_connection_metadata = "update_connection_metadata"


def sanitize(data: BaseModel | dict = None) -> BaseModel | dict:
    """
    Remove credentials and other sensitive information from the data
    """
    if data is None:
        return None

    if isinstance(data, Connection):
        sanitized_data = data.copy()
        sanitized_data.credential = "REDACTED"
        return sanitized_data

    if isinstance(data, ConnectorStatus):
        sanitized_data = data.copy()
        sanitized_data.custom_credentials = "REDACTED"
        return sanitized_data

    if isinstance(data, dict):  # if the current item is a dictionary
        for k, v in data.items():
            data[k] = sanitize(v)

    elif isinstance(data, list):  # if the current item is a list
        for item, i in data:
            data[i] = sanitize(item)

    return data


class Logger:
    posthog_client: Optional[posthog.Client] = None

    def __init__(self):
        # set up posthog logger
        api_key = os.environ.get("POSTHOG_API_KEY")
        host = os.environ.get("POSTHOG_HOST")
        if api_key is not None and host is not None:
            self.posthog_client = posthog.Client(
                api_key=os.environ.get("POSTHOG_API_KEY"),
                host=os.environ.get("POSTHOG_HOST"),
            )

    def log(self, app_config: AppConfig, event: str, properties: Dict[str, Any]):
        if self.posthog_client is not None:
            print("logging event: ", event, " with properties: ", properties)
            self.posthog_client.capture(
                distinct_id=app_config.user_id, event=event, properties=properties
            )

    def log_api_call(
        self,
        app_config: AppConfig,
        event: str,
        request: Optional[BaseModel],
        response: BaseModel,
        error: Exception,
    ):
        # Remove sensitive data from requests and responses
        if self.posthog_client is None:
            return
        if event not in Event.__members__.values():
            raise Exception("Invalid event type")
        properties = {"app_id": app_config.app_id}
        if isinstance(request, BaseModel):
            properties["request"] = sanitize(request).dict()
        if isinstance(response, BaseModel):
            properties["response"] = sanitize(response).dict()
        if error is not None:
            properties["error"] = str(error)
        self.log(app_config=app_config, event="server_" + event, properties=properties)
