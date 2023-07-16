from connectors.github_connector.github_connector import GithubConnector
from .notion_connector import NotionConnector
from .google_drive_connector import GoogleDriveConnector
from .zendesk_connector import ZendeskConnector
from .confluence_connector import ConfluenceConnector
from .slack_connector import SlackConnector
from .dropbox_connector import DropboxConnector
from .intercom_connector import IntercomConnector
from .hubspot_connector import HubspotConnector
from .readme_connector import ReadmeConnector
from .salesforce_connector import SalesforceConnector
from .clickup_connector import ClickupConnector
from .website_connector import WebsiteConnector
from .gmail_connector import GmailConnector
from .sharepoint_connector import SharepointConnector
from models.models import (
    AppConfig,
    DocumentConnector,
    ConversationConnector,
    DataConnector,
    ConnectorId,
    TicketConnector,
)
from typing import Optional


def get_document_connector_for_id(
    connector_id: ConnectorId, config: AppConfig
) -> Optional[DocumentConnector]:
    if connector_id == ConnectorId.confluence:
        return ConfluenceConnector(config)
    elif connector_id == ConnectorId.clickup:
        return ClickupConnector(config)
    elif connector_id == ConnectorId.dropbox:
        return DropboxConnector(config)
    elif connector_id == ConnectorId.gdrive:
        return GoogleDriveConnector(config)
    elif connector_id == ConnectorId.github:
        return GithubConnector(config)
    elif connector_id == ConnectorId.hubspot:
        return HubspotConnector(config)
    elif connector_id == ConnectorId.intercom:
        return IntercomConnector(config)
    elif connector_id == ConnectorId.notion:
        return NotionConnector(config)
    elif connector_id == ConnectorId.readme:
        return ReadmeConnector(config)
    elif connector_id == ConnectorId.salesforce:
        return SalesforceConnector(config)
    elif connector_id == ConnectorId.web:
        return WebsiteConnector(config)
    elif connector_id == ConnectorId.zendesk:
        return ZendeskConnector(config)
    elif connector_id == ConnectorId.sharepoint:
        return SharepointConnector(config)
    return None


def get_conversation_connector_for_id(
    connector_id: ConnectorId, config: AppConfig
) -> Optional[ConversationConnector]:
    if connector_id == ConnectorId.slack:
        return SlackConnector(config)
    elif connector_id == ConnectorId.gmail:
        return GmailConnector(config)
    return None


def get_ticket_connector_for_id(
    connector_id: ConnectorId, config: AppConfig
) -> Optional[TicketConnector]:
    if connector_id == ConnectorId.zendesk:
        return ZendeskConnector(config)
    return None


def get_connector_for_id(
    connector_id: ConnectorId, config: AppConfig
) -> Optional[DataConnector]:
    if connector_id == ConnectorId.confluence:
        return ConfluenceConnector(config)
    elif connector_id == ConnectorId.clickup:
        return ClickupConnector(config)
    elif connector_id == ConnectorId.dropbox:
        return DropboxConnector(config)
    elif connector_id == ConnectorId.github:
        return GithubConnector(config)
    elif connector_id == ConnectorId.gdrive:
        return GoogleDriveConnector(config)
    elif connector_id == ConnectorId.gmail:
        return GmailConnector(config)
    elif connector_id == ConnectorId.hubspot:
        return HubspotConnector(config)
    elif connector_id == ConnectorId.intercom:
        return IntercomConnector(config)
    elif connector_id == ConnectorId.notion:
        return NotionConnector(config)
    elif connector_id == ConnectorId.readme:
        return ReadmeConnector(config)
    elif connector_id == ConnectorId.salesforce:
        return SalesforceConnector(config)
    elif connector_id == ConnectorId.sharepoint:
        return SharepointConnector(config)
    elif connector_id == ConnectorId.slack:
        return SlackConnector(config)
    elif connector_id == ConnectorId.web:
        return WebsiteConnector(config)
    elif connector_id == ConnectorId.zendesk:
        return ZendeskConnector(config)
    return None
