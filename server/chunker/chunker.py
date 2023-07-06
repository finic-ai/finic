from typing import List
from models.models import Document
from bs4 import BeautifulSoup, Tag
import html2text


class DocumentChunker:
    def __init__(self, min_chunk_size: int, max_chunk_size: int):
        self.min_chunk_size = min_chunk_size
        self.max_chunk_size = max_chunk_size

    def chunk(self, documents: List[Document]) -> List[Document]:
        chunks: List[Document] = []

        for document in documents:
            html = document.content
            html_chunks = self.html_to_chunks(
                html, self.min_chunk_size, self.max_chunk_size
            )
            markdown_chunks = self.chunks_to_markdown(html_chunks)
            for chunk in markdown_chunks:
                chunks.append(
                    Document(
                        connector_id=document.connector_id,
                        account_id=document.account_id,
                        title=document.title,
                        content=chunk,
                        uri=document.uri,
                    )
                )
        return chunks

    def html_to_chunks(self, html, min_size=500, max_size=1500):
        soup = BeautifulSoup(html, "html.parser")
        chunks = []
        chunk = ""
        skip_next = False

        for top_level_elem in soup:
            if isinstance(top_level_elem, Tag):
                for i, elem in enumerate(top_level_elem):
                    if isinstance(elem, Tag):
                        if skip_next:
                            skip_next = False
                            continue
                        chunk, skip_next = self.process_element(elem, chunk, chunks)

                # If chunk size is less than min_size and it's last element, append it anyway
                if len(chunk) >= min_size:
                    chunks.append(chunk)
                chunk = ""

        return chunks

    def chunks_to_markdown(self, chunks):
        markdown_chunks = []
        h = html2text.HTML2Text()

        for chunk in chunks:
            md_chunk = h.handle(chunk)
            markdown_chunks.append(md_chunk)

        return markdown_chunks

    def process_element(self, elem, chunk, chunks):
        html_elem = str(elem)

        # If the element is a header and there's a next element, group them together
        if elem.name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
            if elem.find_next_sibling() is not None:
                html_elem += str(elem.find_next_sibling())
                chunk_size = len(chunk + html_elem)
                if chunk_size >= self.max_chunk_size:
                    chunks.append(chunk + html_elem)
                    chunk = ""
                else:
                    chunk += html_elem
                return chunk, True

        # If the element is a list or a table, try to keep it together
        elif elem.name in ["ul", "ol", "table"]:
            html_elem = "".join(str(child) for child in elem.contents)
            chunk_size = len(chunk + html_elem)
            if chunk_size >= self.max_chunk_size:
                chunks.append(chunk + html_elem)
                chunk = ""
            else:
                chunk += html_elem
            return chunk, False

        chunk_size = len(chunk + html_elem)

        # If adding element would exceed max size, finish current chunk and start a new one
        if chunk_size > self.max_chunk_size:
            # if the element is a paragraph, we can split it
            if elem.name == "p":
                remaining_text = html_elem
                while len(remaining_text) > 0:
                    if len(chunk) + len(remaining_text) <= self.max_chunk_size:
                        chunk += remaining_text
                        remaining_text = ""
                    else:
                        # find the index to split the text while keeping it valid
                        split_index = remaining_text[
                            : self.max_chunk_size - len(chunk)
                        ].rfind("<")
                        chunk += remaining_text[:split_index]
                        chunks.append(chunk)
                        chunk = remaining_text[split_index:]
                        remaining_text = ""
            else:
                # for non-paragraph elements, we try to keep them intact
                if chunk:  # if there's any content in the chunk
                    chunks.append(chunk)
                chunk = html_elem
        else:
            chunk += html_elem

        return chunk, False
