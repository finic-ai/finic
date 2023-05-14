from .notion_connector import NotionConnector
from .google_drive_connector import GoogleDriveConnector
from .zendesk_connector import ZendeskConnector
from .confluence_connector import ConfluenceConnector
from models.models import AppConfig, DataConnector, ConnectorId
from typing import Optional

def get_connector_for_id(connector_id: ConnectorId, config: AppConfig) -> Optional[DataConnector]:
    if connector_id == ConnectorId.notion: 
        return NotionConnector(config)
    elif connector_id == ConnectorId.gdrive:
        return GoogleDriveConnector(config)
    elif connector_id == ConnectorId.zendesk:
        return ZendeskConnector(config)
    elif connector_id == ConnectorId.confluence:
        return ConfluenceConnector(config)
    return None
