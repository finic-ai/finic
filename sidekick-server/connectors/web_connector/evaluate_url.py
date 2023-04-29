from urllib.parse import urlparse
from pathlib import Path

def get_full_doc_url(root_scheme: str, root_host: str, path: str):
    return root_scheme + "://" + root_host.strip('/') + '/' + path.strip('/')    

## Decide if we should treat this url as a document. If so, return the relative path of the url.
def evaluate_url(parent_url: str, url: str, root_scheme: str, root_host: str, root_path: str):
    url = url.split('#')[0]    
    url = url.rstrip('/')
    parsed = urlparse(url)
    hostname = parsed.hostname or root_host
    
    # if this url is relative to the scheme or root host, reconstruct the full url
    if url.startswith("//"):
        parsed = urlparse(root_scheme + ":" + url)
    elif url.startswith("/"):
        parsed = urlparse(root_scheme + "://" + root_host + url)
    
    # if this url is relative to a page, convert it to the full url based on the url of the page that contained this link
    if not parsed.hostname:
        path = Path(url)
        parent_path = Path(urlparse(parent_url).path)
        if parent_url.endswith("html"):
            new_path = parent_path.parent
        else:
            new_path = parent_path
        for part in path.parts:
            if part == "..":
                new_path = new_path.parent
            else:
                new_path = new_path / part
        final_url = get_full_doc_url(root_scheme, root_host, str(new_path))
        parsed = urlparse(final_url)

    # if this is not a valid url, ignore it
    if not parsed.scheme and not parsed.hostname:
        return None

    # if we ended up with a url that's not on the same domain, ignore it
    if hostname != root_host:
        return None
    
    # if this path is to a file, ignore it
    path_end = parsed.path.split(".")[-1]
    if path_end in ["jpg", "png", "bin", "gif", "pdf", "zip", "gz", "bz2", "xz", "tar", "tgz", "tbz2", "7z", "rar", "mp3", "mp4", "ogg", "wav", "avi", "mov", "wmv", "flv", "swf", "css", "js", "ico", "svg", "woff", "woff2", "ttf", "eot", "otf", "txt", "md", "json", "xml", "yaml", "yml", "csv", "tsv", "ics"]:
        return None
    
    # if this path doesn't match a path with docs, ignore it
    if not parsed.path.strip("/").startswith(root_path.strip("/")):
        return None
    
    # This is a document we want to process. Return the full url
    return get_full_doc_url(root_scheme, root_host, parsed.path)