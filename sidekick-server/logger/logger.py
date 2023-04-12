import os
import posthog
from typing import Optional, Dict, Any
from enum import Enum
from models.models import AppConfig

# Enum of logging events
class Event(str, Enum):
    ask_llm = "ask_llm"
    query = "query"
    upsert_data = "upsert_data"

class Logger:
    posthog_client: Optional[posthog.Client] = None

    def __init__(self, app_config: AppConfig):
        # set up posthog logger
        self.posthog_client = posthog.Client(
            api_key=os.environ.get('POSTHOG_API_KEY'),
            host=os.environ.get('POSTHOG_HOST')
        )
        self.app_id = app_config.app_id

    def log(self, event: str, properties: Dict[str, Any]):
        if self.posthog_client is not None:
            self.posthog_client.capture(distinct_id=self.app_id, event=event, properties=properties)

    def log_ask_llm(self, query: str, response: str, error: bool):
        properties = {
            'app_id': self.app_id,
            'query': query,
            'response': response,
            'error': error
        }
        self.log(event=Event.ask_llm, properties=properties)

    def log_query(self, query: str, response: str, error: bool):
        properties = {
            'app_id': self.app_id,
            'query': query,
            'response': response,
            'error': error
        }
        self.log(event=Event.query, properties=properties)

    def log_upsert_data(self, connector: int, chunks: int, error: bool):
        properties = {
            'app_id': self.app_id,
            'connector': connector,
            'chunks': chunks,
            'error': error
        }
        self.log(event=Event.upsert_data, properties=properties)