from bs4 import BeautifulSoup, Tag
from typing import List
import tiktoken
CONTENT_TAGS = ['body', 'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'main', 'nav', 'section', 'search', 
                'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure', 'hr', 'li', 'menu', 'ol', 'p', 'pre', 'ul', 
                'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr',
                'area', 'audio', 'img', 'map', 'track', 'video',
                'embed', 'fencedframe', 'iframe', 'object', 'picture', 'portal', 'source',
                'svg', 'math',
                'canvas', 'noscript', 'script',
                'del', 'ins',
                'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
                'button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend', 'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea',
                'details', 'dialog', 'summary',
                'slot', 'template',
                'acronym', 'big', 'center', 'content', 'dir', 'font', 'font', 'frame', 'frameset', 'image', 'marquee', 'menuitem', 'nobr', 'noembed', 'noframes', 'param', 'plaintext', 'rb', 'rtc', 'shadow', 'strike', 'tt', 'xmp'
                ]

def sanitize_html(tag: Tag) -> Tag:
    """
    Sanitize the HTML content by removing metadata and other noise. This makes it easier for LLMs to parse the content.
    """

    for tag in tag.find_all(True):
        if tag.name not in CONTENT_TAGS:
            tag.decompose()
        # remove all attributes except for href, id, src, class, title, alt, aria-*, data-*
        for attr in tag.attrs:
            if attr not in ['href', 'id', 'src', 'class', 'title', 'alt', 'aria-*', 'data-*']:
                del tag.attrs[attr]
    
    return tag

def html_string_to_body_tag(html_string: str) -> Tag:
    """
    Convert a string to a BeautifulSoup Tag.
    """
    soup = BeautifulSoup(html_string, 'html.parser')
    body = soup.find('body')
    return sanitize_html(body)

def chunk_tag(self, tag: Tag, max_tokens: int = 50000) -> List[Tag]:
    """
    Recursively break down large tags that exceed the max token limit into child tags
    that do not exceed the max token limit.
    
    Args:
        tag (Tag): The BeautifulSoup Tag to process.
        max_tokens (int): The maximum number of tokens allowed for a child.
    """
    encoder = tiktoken.encoding_for_model("gpt-4o")
    tags = []
    
    if len(encoder.encode(str(child))) <= max_tokens:
        return [tag]
    
    for child in tag.children:
        if isinstance(child, Tag):
            child_tokens = len(self.encoder.encode(str(child)))
            if child_tokens > max_tokens:
                # If child is too large, process its children
                tags.extend(chunk_tag(child, max_tokens))
            else:
                # If child is small enough, regenerate selector with it
                tags.append(child)
    return tags