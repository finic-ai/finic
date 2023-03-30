from pathlib import Path
import typing
import html
from models.models import DocumentChunk
from typing import List

from chunkers.markdown_chunker.markdown_chunker import chunk_markdown_content

def get_title(lines: typing.List[str], url: Path):
    if url.suffix == '.rst':
        if lines[0].startswith('==='):
            return lines[1]
    for l in lines:
        if l.startswith('# '):
            return l[2:]
        if l.startswith('## '):
            return l[3:]
    return url.name
    

def load_data(  repo_path: Path, 
                docs_path: Path, 
                github_url: str = '',
                hosted_url: str = '',
                extension: str = '',
                product_id: str = 'GITHUB_MARKDOWN') -> List[DocumentChunk]:
    chunks = []
    for i, p in enumerate(repo_path.glob("**/*")):
        if p.suffix not in [".md", ".mdx", ".rst"]:
            continue
        is_docs = str(docs_path) in str(p)

        if is_docs:
            url = p.relative_to(docs_path)
        else:
            url = p.relative_to(repo_path)

        if (url.name).lower() in ['readme.md', 'index.md']:
            url = url.parent / 'index.html'
        else:
            url = url.with_suffix(extension)

        if str(url) == '.':
            url = ''

        content = p.read_text()

        lines = content.splitlines()
        title = None if len(lines) == 0 else get_title(lines, url)

        if len(hosted_url) > 0:
            source = f"{hosted_url}/{str(url)}"
        else:
            source = f"{github_url}/{url}"

        if title is None or len(content) < 500:
            continue

        chunks.extend(chunk_markdown_content(html.escape(content), source, title, product_id))
    
    return chunks