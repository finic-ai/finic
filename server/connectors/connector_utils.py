from .notion_connector import NotionConnector
from .google_drive_connector import GoogleDriveConnector
from models.models import AppConfig, DataConnector, ConnectorId
from typing import Optional

def get_connector_for_id(connector_id: ConnectorId, config: AppConfig) -> Optional[DataConnector]:
    if connector_id == 'notion': 
        return NotionConnector(config)
    elif connector_id == 'gdrive':
        return GoogleDriveConnector(config)
    return None
