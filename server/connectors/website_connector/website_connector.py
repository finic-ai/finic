from __future__ import annotations
import time
import uuid
from urllib.parse import urlparse
from pathlib import Path
from bs4 import BeautifulSoup, PageElement, Tag
# from playwright.sync_api import sync_playwright, Browser
from playwright.async_api import async_playwright, Browser
from tqdm import tqdm
import random
from models.models import Source, AppConfig, Document, DocumentMetadata, AuthorizationResult, DataConnector
from typing import List, Optional
from connectors.web_connector.evaluate_url import evaluate_url


create_document = lambda title, text, url, source_type, : Document(text)


async def load_data_from_url(source_id: str, url: str, config: AppConfig, source_type: Source, css_connector: str) -> Document:
    """
    Convert HTML within the element matching css_connector to text, or if css_connector is None, convert the entire page to text.
    """
    tenant_id = config.tenant_id
    parsed = urlparse(url)
    # if this is not a valid url, ignore it
    if not parsed.scheme and not parsed.hostname:
        return None
    
    ## Use playwright to load the page. More reliable than using http requests.
    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            page.set_default_timeout(60000)
            response = await page.goto(url, wait_until='domcontentloaded')
            status = response.status
            content = await page.content()
            if status != 200:
                raise Exception(f"HTTP error occurred: {status}")
            if 'Checking if the site connection is secure' in content:
                raise Exception("Blocked by cloudflare")
            soup = BeautifulSoup(content, "html.parser")
            if css_connector:
                elements = soup.select(css_connector)
            else:
                elements = [soup]

            ## TODO: If more than one element matches the selector, combine all matching elements into a single Document
            combined = elements
            if len(elements) > 1:
                combined = soup.new_tag("div")
                for element in elements:
                    combined.append(element)
            
            documents = Document(
                title = url,
                text = str(combined),
                url = url,
                source_type = source_type,
                metadata = DocumentMetadata(
                    source_id = source_id,
                    tenant_id = tenant_id,
                    document_id = str(uuid.uuid4())),
                )
            await page.close()
            return documents
        except Exception as e:
            tqdm.write(f'Something went wrong: {url} {e}')
            return None


class WebsiteConnector(DataConnector):
    source_type: Source = Source.web
    connector_id: int = 2
    config: AppConfig
    urls: List[str]
    css_selector: Optional[str] = None

    def __init__(self, config: AppConfig, urls: List[str], css_selector: str):
        super().__init__(config=config, urls=urls, css_selector=css_selector)

    async def authorize(self) -> AuthorizationResult:
        pass

    async def load(self, source_id: str) -> List[Document]:
        documents = []
        for url in self.urls:
            parsed_url = urlparse(url)
            if parsed_url.scheme not in ["http", "https"]:
                raise Exception(f"Invalid URL: {url}")
            document = await load_data_from_url(source_id, url, self.config, self.source_type, self.css_selector)
            documents.append(document)
            time.sleep(random.uniform(1, 2))
        return documents