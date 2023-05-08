from __future__ import annotations
from markdownify import MarkdownConverter
import time
import uuid
from urllib.parse import urlparse
from pathlib import Path
from bs4 import BeautifulSoup, PageElement, Tag
# from playwright.sync_api import sync_playwright, Browser
from playwright.async_api import async_playwright, Browser
from tqdm import tqdm

from models.models import Source, AppConfig, Document, DocumentMetadata, AuthorizationResult, DataConnector
from typing import List, Optional

from connectors.web_connector.evaluate_url import evaluate_url

def get_full_doc_url(root_scheme: str, root_host: str, docs_path: str, path: str):
    if docs_path in path:
        return root_scheme + "://" + root_host.strip('/') + '/' + path.strip('/')
    return root_scheme + "://" + root_host.strip('/') + '/' + docs_path.strip('/') + '/' + path.strip('/')    

async def get_page_content(b: Browser, url: str, cache_path: str):
    parsed = urlparse(url)
    if url.endswith('.txt'):
        file_path = cache_path / parsed.path.replace("/", "_")
    else:
        file_path = cache_path / (parsed.path.replace("/", "_") + ".html")
    
    if file_path.exists():
        return file_path.read_text()


    tqdm.write(f'New page: {url}')
    try:
        page = await b.new_page()
        page.set_default_timeout(60000)
        response = await page.goto(url, wait_until='domcontentloaded')
        status = response.status
        content = await page.content()
        if 'Checking if the site connection is secure' in content:
            raise Exception("Blocked by cloudflare")
        time.sleep(1)
        if status != 200:
            raise Exception(f"HTTP error occurred: {status}")
        await page.close()
        file_path.write_text(content)
    except Exception as e:
        tqdm.write(f'Something went wrong: {url} {e}')
        return None
    return content

async def load_data_from_url(source_id: str, url: str, config: AppConfig, source_type: Source) -> List[Document]:
    """
    Recursively crawl a domain, cache all web pages, and return a list of Documents with the raw HTML content of each page.
    """
    tenant_id = config.tenant_id
    # Create a directory to store the pages
    cache_path = Path(f"./pages_cache_{source_id}")
    cache_path.mkdir(exist_ok=True)

    # Find all the links on the page and navigate to each one
    root = urlparse(url)
    root_scheme = root.scheme
    root_host = root.hostname
    root_path = root.path
    start_url = evaluate_url("", url, root_scheme, root_host, root_path)
    if start_url is None:
        return
    links = [start_url]
    visited = set()
    observed = set(links)
    t = tqdm(total=len(links), unit='pages')
    documents: List[Document] = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        while links:
            link = links.pop(0)
            visited.add(link)
            content = await get_page_content(browser, link, cache_path)
            if content:
                soup = BeautifulSoup(content, 'html.parser')
                document = Document(
                    title="",
                    text=content,
                    url=link,
                    source_type=source_type,
                    metadata=DocumentMetadata(
                        document_id=str(uuid.uuid4()),
                        source_id=source_id,
                        tenant_id=tenant_id,
                    )
                )
                documents.append(document)
                # Find all the links on the page
                for new_link in soup.find_all("a", recursive=True):
                    new_href = evaluate_url(link, new_link.get("href", ''), root_scheme, root_host, root_path)
                    if new_href and new_href not in observed:
                        links.append(new_href)
                        observed.add(new_href)
                        t.total += 1
                        t.update(0)
            t.update(1)
        t.close()
        return documents

class WebConnector(DataConnector):
    source_type: Source = Source.web
    connector_id: int = 2
    config: AppConfig
    url: str

    def __init__(self, config: AppConfig, url: str):
        super().__init__(config=config, url=url)

    def authorize(self) -> AuthorizationResult:
        return AuthorizationResult(authorized=True)

    async def load(self, source_id: str) -> List[Document]:
        return await load_data_from_url(source_id, self.url, self.config, self.source_type)