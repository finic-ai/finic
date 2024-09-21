import os
from pydantic import BaseModel
from typing import Union
from playwright.sync_api import Page
from bs4 import Tag
import requests

api_key = os.getenv('FINIC_API_KEY')

class FinicSelector(BaseModel):
  id: str = ""
  selector_string: str = ""
  description: str = ""
  
  def __init__(self, id: str, selector: str, description: str):
    self.id = id
    self.selector_string = selector
    self.description = description
    
  def regenerate_selector(self, page: Union[str, Page, Tag]):
    """
    Regenerate the selector string using the Finic Selector Service.

    This method sends a request to the Finic API to regenerate the selector
    based on the provided page content and a description of the HTML element. 
    The new selector is then stored in the `selector_string` attribute.

    Args:
        page (Union[str, Page, Tag]): The page content to use for regenerating
            the selector. Can be a string of HTML, a Playwright Page object,
            or a BeautifulSoup Tag object.
    Raises:
        requests.RequestException: If there's an error with the API request.
        ValueError: If the API response is invalid or missing the selector.

    Note:
        This method requires a valid FINIC_API_KEY environment variable.
    """
    response = requests.post(
      "https://api.finic.io/regenerate-selector", 
      json={
        "page": page, 
        "description": self.description,
        "defunct_selector": self.selector_string
      }, 
      headers={"Authorization": f"Bearer {api_key}"}
    )
    self.selector_string = response.json()["selector"]