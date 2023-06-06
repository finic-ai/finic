from .notion_connector import NotionConnector
from .google_drive_connector import GoogleDriveConnector
from .zendesk_connector import ZendeskConnector
from .confluence_connector import ConfluenceConnector
from .slack_connector import SlackConnector
from .dropbox_connector import DropboxConnector
from .intercom_connector import IntercomConnector
from .hubspot_connector import HubspotConnector
from models.models import AppConfig, DocumentConnector, ConversationConnector, DataConnector, ConnectorId
from typing import Optional

def get_document_connector_for_id(connector_id: ConnectorId, config: AppConfig) -> Optional[DocumentConnector]:
    if connector_id == ConnectorId.notion: 
        return NotionConnector(config)
    elif connector_id == ConnectorId.gdrive:
        return GoogleDriveConnector(config)
    elif connector_id == ConnectorId.zendesk:
        return ZendeskConnector(config)
    elif connector_id == ConnectorId.confluence:
        return ConfluenceConnector(config)
    elif connector_id == ConnectorId.dropbox:
        return DropboxConnector(config)
    elif connector_id == ConnectorId.intercom:
        return IntercomConnector(config)
    elif connector_id == ConnectorId.hubspot:
        return HubspotConnector(config)
    return None

def get_conversation_connector_for_id(connector_id: ConnectorId, config: AppConfig) -> Optional[ConversationConnector]:
    if connector_id == ConnectorId.slack:
        return SlackConnector(config)
    return None

def get_connector_for_id(connector_id: ConnectorId, config: AppConfig) -> Optional[DataConnector]:
    if connector_id == ConnectorId.notion: 
        return NotionConnector(config)
    elif connector_id == ConnectorId.gdrive:
        return GoogleDriveConnector(config)
    elif connector_id == ConnectorId.zendesk:
        return ZendeskConnector(config)
    elif connector_id == ConnectorId.confluence:
        return ConfluenceConnector(config)
    elif connector_id == ConnectorId.slack:
        return SlackConnector(config)
    elif connector_id == ConnectorId.dropbox:
        return DropboxConnector(config)
    elif connector_id == ConnectorId.intercom:
        return IntercomConnector(config)
    elif connector_id == ConnectorId.hubspot:
        return HubspotConnector(config)
    return None
