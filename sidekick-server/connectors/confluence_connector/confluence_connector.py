from __future__ import annotations
from markdownify import MarkdownConverter
import time
import uuid
import requests
from urllib.parse import urlparse
from pathlib import Path
from bs4 import BeautifulSoup, PageElement, Tag
# from playwright.sync_api import sync_playwright, Browser
from playwright.async_api import async_playwright, Browser
from tqdm import tqdm

from models.models import Source, AppConfig, Document, DocumentMetadata, DocumentChunk, DataConnector
from typing import List

def load_pages(config: ConfluenceAppConfig) -> List[Document]:
    confluence_domain = config.confluence_domain
    username = config.username
    api_token = config.api_token
    space_key = config.space_key

    auth = (username, api_token)
    headers = {"Accept": "application/json"}

    url = f"{confluence_domain}/wiki/rest/api/content?spaceKey={space_key}&expand=version,space"
    all_pages = []

    while url:
        response = requests.get(url, auth=auth, headers=headers)
        response.raise_for_status()
        data = response.json()
        all_pages.extend(data["results"])

        if data["_links"]["next"]:
            url = data["_links"]["next"]
        else:
            url = None

    return all_pages

class ConfluenceAppConfig(AppConfig):
    confluence_domain: str
    username: str
    api_token: str
    space_key: str

class ConfluenceConnector(DataConnector):
    source_type: Source = Source.confluence
    config: ConfluenceAppConfig

    def __init__(self, config: ConfluenceAppConfig, url: str):
        super().__init__(config=config, url=url)

    async def load(self, source_id: str) -> List[Document]:
        try:
            return load_pages(self.config)
        except Exception as e:
            print(f'Error loading pages: {e}')
            raise e