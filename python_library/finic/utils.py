from typing import Optional
from playwright.sync_api import Response


def get_cookies_from_string(cookies_string: str, url: Optional[str] = None, domain: Optional[str] = None, path: Optional[str] = None):
  # Split the content by ";"
  pairs = cookies_string.split("; ")

  cookies = []

  # Populate the dictionary
  for pair in pairs:
      if "=" in pair:
          key, value = pair.split("=", 1)
          cookie = {"name": key, "value": value}
          if url:
              cookie["domain"] = url
          elif domain and path:
              cookie["domain"] = domain
              cookie["path"] = path
          else:
              raise ValueError("Either url, or domain and path must be provided")
          cookies.append(cookie)

  return cookies

def handle_response(response: Response):
    pass