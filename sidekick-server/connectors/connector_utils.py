from .google_docs_connector import GoogleDocsConnector
from .web_connector import WebConnector
from .zendesk_connector import ZendeskConnector
from .confluence_connector import ConfluenceConnector
from .notion_connector import NotionConnector
from .dropbox_connector import DropboxConnector
from .stripe_connector import StripeConnector
from .github_connector import GithubConnector
from models.models import AppConfig, DataConnector
from typing import Optional

def get_connector_for_id(connector_id: int, config: AppConfig, path: Optional[str] = "") -> Optional[DataConnector]:
    index = connector_id - 1
    connectors = [
        GoogleDocsConnector(config=config, folder_name=path),
        WebConnector(config=config, url=path),
        None,
        NotionConnector(config=config),
        ZendeskConnector(config=config, folder_name=path),
        ConfluenceConnector(config=config, space=path),
        DropboxConnector(config=config, folder_name=path),
        StripeConnector(config=config),
        GithubConnector(config=config, repo_name=path)
    ]
    return connectors[index]