
from .notion_connector import NotionConnector
from models.models import AppConfig, DataConnector
from typing import Optional

def get_connector_for_id(connector_id: int, config: AppConfig) -> Optional[DataConnector]:
    index = connector_id - 1
    connectors = [
        NotionConnector(config=config),
    ]
    return connectors[index]