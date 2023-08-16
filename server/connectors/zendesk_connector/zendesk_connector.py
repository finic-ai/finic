from models.models import (
    AppConfig,
    Document,
    ConnectorId,
    AuthorizationResult,
    DocumentConnector,
    TicketConnector,
    ConnectionFilter,
    GetTicketsResponse,
)
from models.api import GetDocumentsResponse
from typing import List, Optional
from urllib.parse import urlencode, urlunparse, urlparse, ParseResult
from googleapiclient.discovery import build
from appstatestore.statestore import StateStore
import os
import uuid
import json
import importlib
from typing import Dict
import json
import requests
from bs4 import BeautifulSoup
from document_processors import PIIRedactor

from .zendesk_parser import ZendeskParser


class ZendeskConnector(DocumentConnector, TicketConnector):
    connector_id: ConnectorId = ConnectorId.zendesk
    config: AppConfig

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize_api_key(
        self, account_id: str, credential: Dict, metadata: Dict
    ) -> AuthorizationResult:
        credential_string = json.dumps(credential)
        subdomain = metadata["subdomain"]

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=credential_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={"subdomain": subdomain},
        )

        return AuthorizationResult(authorized=True, connection=new_connection)

    async def authorize(
        self, account_id: str, auth_code: Optional[str], metadata: Dict
    ) -> AuthorizationResult:
        connector_credentials = StateStore().get_connector_credential(
            self.connector_id, self.config
        )
        try:
            client_id = connector_credentials["client_id"]
            client_secret = connector_credentials["client_secret"]
            print("metadata", metadata)
            subdomain = metadata["subdomain"]
            redirect_uri = connector_credentials["redirect_uri"]
        except Exception as e:
            raise Exception("Connector is not enabled")

        scopes = "read"
        if self.config.app_id == "15edc3c2-ec0d-429a-ad1c-497aea3d7384":
            scopes = "hc:read"

        if not auth_code:
            auth_url = f"https://{subdomain}.zendesk.com/oauth/authorizations/new"
            
            params = {
                "response_type": "code",
                "redirect_uri": redirect_uri,
                "client_id": client_id,
                "scope": scopes,
            }
            encoded_params = urlencode(params)
            url_parts = urlparse(auth_url)
            auth_url = ParseResult(
                scheme=url_parts.scheme,
                netloc=url_parts.netloc,
                path=url_parts.path,
                params=url_parts.params,
                query=encoded_params,
                fragment=url_parts.fragment,
            ).geturl()
            return AuthorizationResult(authorized=False, auth_url=auth_url)

        try:
            # encode in base 64
            headers = {
                "Content-Type": "application/json",
            }

            data = {
                "code": auth_code,
                "grant_type": "authorization_code",
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
                "scope": scopes,
            }

            response = requests.post(
                f"https://{subdomain}.zendesk.com/oauth/tokens",
                headers=headers,
                json=data,
            )

            creds = response.json()
            creds_string = json.dumps(creds)

        except Exception as e:
            print(e)
            raise Exception("Unable to get access token with code")

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=creds_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata=metadata,
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    async def get_sections(self, account_id: str) -> List[str]:
        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )
        credential_json = json.loads(connection.credential)

        subdomain = connection.metadata["subdomain"]
        parser = ZendeskParser(subdomain=subdomain, credential=credential_json)
        sections = parser.list_sections()
        return sections

    async def load(self, connection_filter: ConnectionFilter) -> GetDocumentsResponse:
        account_id = connection_filter.account_id
        uris = connection_filter.uris
        section_filter = connection_filter.section_filter_id
        # initialize credentials
        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )
        credential_json = json.loads(connection.credential)

        subdomain = connection.metadata["subdomain"]

        documents = []
        parser = ZendeskParser(subdomain, credential_json)

        articles = []
        if uris:
            articles = parser.get_articles_by_uris(uris)
        elif section_filter:
            # retrieve the SectionFilter based on the section_filter id
            connection_filter = ConnectionFilter(
                connector_id=self.connector_id, account_id=account_id
            )
            connections = StateStore().get_connections(
                filter=connection_filter,
                config=self.config,
            )
            connection = connections[0]
            filters = connection.section_filters
            # get the filter with the right id
            sections = []
            for filter in filters:
                if filter.id == section_filter:
                    sections = filter.sections

            for section in sections:
                articles_in_section = parser.get_all_articles(section.id)
                articles.extend(articles_in_section)

        else:
            articles = parser.get_all_articles()

        for article in articles:
            title = article["title"]
            article_url = article["html_url"]
            body = article["body"]
            # text = BeautifulSoup(body, "html.parser").get_text()
            if body and title and article_url:
                documents.append(
                    Document(
                        title=title,
                        content=body,
                        connector_id=self.connector_id,
                        account_id=account_id,
                        uri=article_url,
                    )
                )

        return GetDocumentsResponse(documents=documents)

    async def load_tickets(
        self, connection_filter: ConnectionFilter, redact_pii: bool = False
    ) -> GetTicketsResponse:
        account_id = connection_filter.account_id
        uris = connection_filter.uris
        section_filter = connection_filter.section_filter_id
        # initialize credentials
        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )
        credential_json = json.loads(connection.credential)

        subdomain = connection.metadata["subdomain"]

        parser = ZendeskParser(subdomain, credential_json)

        tickets = []
        next_page_cursor = None
        while True:
            raw_tickets, next_page_cursor = parser.get_all_tickets(
                None, next_page_cursor
            )

            for raw_ticket in raw_tickets:
                content = raw_ticket["content"]

                if redact_pii:
                    pii_redactor = PIIRedactor()
                    content = pii_redactor.redact(content)
                tickets.append(
                    Document(
                        title=raw_ticket["title"],
                        content=content,
                        connector_id=self.connector_id,
                        account_id=account_id,
                        uri=raw_ticket["uri"],
                    )
                )

            # Break the loop if there is no next page
            if not next_page_cursor:
                break

        return GetTicketsResponse(tickets=tickets, next_page_cursor=next_page_cursor)