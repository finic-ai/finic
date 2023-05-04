import markdown2
from pathlib import Path
import uuid
from markdownify import MarkdownConverter
import json
from langchain.text_splitter import MarkdownTextSplitter
from bs4 import BeautifulSoup, PageElement, Tag
from typing import List
from models.models import (
    DocumentChunk,
    Source
)

markdown_splitter = MarkdownTextSplitter(chunk_size=500, chunk_overlap=100)

def md(soup, **options) -> str:
    if (soup is None):
        return None
    return MarkdownConverter(**options).convert_soup(soup)

def generate_uuid(blocks: list[str]) -> List[str]:
    for block in blocks:
        id = str(uuid.uuid4())
        block['id'] = id
    return blocks

def chunk_markdown_content(markdown_content: str, source: str, title: str, product: str) -> List[DocumentChunk]:
    """
    Parse markdown into large chunks, using headers as the delimiter.
    """
    html = markdown2.markdown(markdown_content, extras=["tables"])
    soup = BeautifulSoup(html, 'html.parser')
    chunks = []
    h2 = None
    h3 = None
    h4 = None
    content = []


    # Update all relative links to absolute links
    for a in soup.find_all('a', href=True):
        source_path = Path(source).parent
        href = a['href']
        if href.startswith('/') or href.startswith('#'):
            a['href'] = source_path / href
        # For complex relative links, e.g. ../../../../, we need to go up the directory tree
        elif not href.startswith('http'):
            parts = Path(href).parts
            for part in parts:
                if part == '..':
                    source_path = source_path.parent
                else:
                    if part.endswith('.md'):
                        part = part[:-3]
                    source_path = source_path / part
            a['href'] = source_path

    def get_new_block(c: list[Tag]) -> DocumentChunk:
        if (len(c) == 0):
            return None
        stripped_content = " ".join([tag.get_text(" ") for tag in c])
        stripped_content = " ".join(stripped_content.split())
        raw_markdown = "\n\n".join(md(tag) for tag in c)
        ## Remove any empty content blocks, e.g. those with only images
        if (len(stripped_content) < 1):
            return None
        chunk = DocumentChunk(
            id=str(uuid.uuid4()),
            content=content,
            raw_markdown=raw_markdown,
            title=title,
            h2=md(h2),
            h3=md(h3),
            h4=md(h4),
            product=product,
            source_type=Source.github_markdown,
            url=source
        )
        return chunk

    for tag in soup.children:
        ## Reset all lower level headers if we hit a higher level header)
        if tag.name == 'h1':
            chunks.append(get_new_block(content))
            content = []
            h2 = None
            h3 = None
            h4 = None
        elif tag.name == 'h2':
            chunks.append(get_new_block(content))
            content = []
            h2 = tag
            h3 = None
            h4 = None
        elif tag.name == 'h3':
            chunks.append(get_new_block(content))
            content = []
            h3 = tag
            h4 = None
        elif tag.name == 'h4':
            chunks.append(get_new_block(content))
            content = []
            h4 = tag
        elif tag.name in ['p', 'ul', 'ol', 'pre']:
            content.append(tag)
            continue
    chunks.append(get_new_block(content))
    return chunks