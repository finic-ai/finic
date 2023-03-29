from bs4 import BeautifulSoup, PageElement, Tag
from markdownify import MarkdownConverter
import re
import uuid
import tiktoken

from models.models import (
    DocumentChunk,
    Source
)


def md(soup, **options):
    if (soup is None):
        return None
    return MarkdownConverter(**options).convert_soup(soup)

def strip_non_alphanumeric(s):
    """
    Remove all spaces, tabs, newlines and non-alphanumeric characters from the beginning and end of a string.
    """
    return re.sub(r'^[\s\W]*[^\w.,!?]|(?<![.,!?])[\s\W]*$', '', s)

def create_chunks(url: str, product_id: str, headers: dict, elements: list[Tag], token_limit: int = 1000):
    combined_soup = BeautifulSoup()
    for element in elements:
        combined_soup.append(element)

        raw_markdown = md(combined_soup)
        content = combined_soup.get_text(" ").strip()
        # Remove extra whitespace
        content = re.sub(r"\s{2,}", " ", content).replace("\n ", "\n")
        # If no tags have text content, ignore this chunk
        if not content:
            return None
        
        h1 = headers.get("h1")
        h2 = headers.get("h2")
        h3 = headers.get("h3")
        h4 = headers.get("h4")

        if (not h1) and (not h2) and (not h3) and (not h4):
            return None
        
        chunk = DocumentChunk(
            id=str(uuid.uuid4()),
            content=content,
            raw_markdown=raw_markdown,
            title=headers.get("h1"),
            h2=headers.get("h2"),
            h3=headers.get("h3"), 
            h4=headers.get("h4"),
            product=product_id,
            source_type=Source.web,
            url=url
        )
        return [chunk]
    
def chunk_html_content(soup: BeautifulSoup, url: str, product: str, token_limit: int = 1000):
    head = soup.find("head")
    contents = head.find_all_next(["h1", "h2", "h3", "h4", "p", "ul", "ol", "pre", "table"])

    all_chunks = []
    
    headers = {
        "h1": None,
        "h2": None,
        "h3": None,
        "h4": None
    }

    # Parse HTML into chunks separated by headers
    elements = []
    for tag in contents:
        if tag.name in ["h1", "h2", "h3", "h4"]:
            if len(elements) > 0:
                chunks = create_chunks(url, product, headers, elements)
                if chunks:
                    all_chunks.extend(chunks)
            elements = []
            if tag.name == "h1":
                headers["h1"] = strip_non_alphanumeric(tag.get_text())
                headers["h2"] = None
                headers["h3"] = None
                headers["h4"] = None
            elif tag.name == "h2":
                headers["h2"] = strip_non_alphanumeric(tag.get_text())
                headers["h3"] = None
                headers["h4"] = None
            elif tag.name == "h3":
                headers["h3"] = strip_non_alphanumeric(tag.get_text())
                headers["h4"] = None
            elif tag.name == "h4":
                headers["h4"] = strip_non_alphanumeric(tag.get_text())
        else:
            elements.append(tag)
    
    if len(elements) > 0:
        chunks = create_chunks(url, product, headers, elements, token_limit)
        if chunks:
            all_chunks.extend(chunks)
        
    return all_chunks