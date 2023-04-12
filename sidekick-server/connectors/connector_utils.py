from .google_docs_connector import GoogleDocsConnector
from .web_connector import WebConnector
from .zendesk_connector import ZendeskConnector
from .confluence_connector import ConfluenceConnector
from models.models import AppConfig, DataConnector
from typing import Optional

def get_connector_for_id(connector_id: int, config: AppConfig, path: Optional[str] = "") -> Optional[DataConnector]:
    index = connector_id - 1
    connectors = [
        GoogleDocsConnector(config=config, folder_name=path),
        WebConnector(config=config, url=path),
        None,
        None,
        ZendeskConnector(config=config, folder_name=path),
        ConfluenceConnector(config=config, space=path)
    ]
    return connectors[index]