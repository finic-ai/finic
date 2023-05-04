from .google_docs_connector import GoogleDocsConnector
from .web_connector import WebConnector
from .zendesk_connector import ZendeskConnector
from .confluence_connector import ConfluenceConnector
from .notion_connector import NotionConnector
from models.models import AppConfig, DataConnector, ConnectorId
from typing import Optional

def get_connector_for_id(connector_id: ConnectorId, config: AppConfig) -> Optional[DataConnector]:
    if connector_id == 'notion':
        return NotionConnector(config)
    return None
