from typing import Dict, List, Optional
from models.models import Section, SectionType
import requests

class ZendeskParser:

    def __init__(self, subdomain: str, credential: Dict):
        self.subdomain = subdomain
        self.credential = credential

        self.is_oauth = False
        self.api_key = None
        self.email = None
        self.access_token = None

        if "api_key" in credential:
            self.api_key = credential["api_key"]
            self.email = credential["email"]
        else:
            self.is_oauth = True
            self.access_token = credential["access_token"]

    def get_articles_by_uris(self, uris: List[str]) -> list:
        articles = []

        for uri in uris:
            id = self.get_id_from_uri(uri)
            api_url = f"https://{self.subdomain}.zendesk.com/api/v2/help_center/articles/{id}"
            response = self.call_zendesk_api(api_url)
            if response.status_code != 200:
                print(f"Error: Unable to fetch article. Status code: {response.status_code}")
                return []
            article = response.json()["article"]
            articles.append(article)

        return articles


    def get_all_articles(self, section_id: Optional[str] = None) -> list:
        articles = []
        if section_id:
            base_url = f"https://{self.subdomain}.zendesk.com/api/v2/help_center/sections/{section_id}/articles.json"
        else:
            base_url = f"https://{self.subdomain}.zendesk.com/api/v2/help_center/articles.json"

        while base_url:
            response = self.call_zendesk_api(base_url)
            if response.status_code != 200:
                print(f"Error: Unable to fetch articles. Status code: {response.status_code}")
                return []

            data = response.json()
            articles.extend(data["articles"])
            base_url = data["next_page"]

        return articles
    
    def list_sections(self) -> List[Section]:
        base_url = f"https://{self.subdomain}.zendesk.com/api/v2/help_center/sections.json"
        response = self.call_zendesk_api(base_url)
        if response.status_code != 200:
            print(f"Error: Unable to fetch sections. Status code: {response.status_code}")
            return []
        data = response.json()
        return [Section(id=section["id"], name=section["name"], type=SectionType.folder, children=[]) for section in data["sections"]]

    
    def get_id_from_uri(self, uri: str) -> str:
        id = uri.split("/")[-1]
        # If there is a - in the id we want to get the first part of the id
        if "-" in id:
            id = id.split("-")[0]
        return id

    def call_zendesk_api(self, url):
        if self.is_oauth:
            response = requests.get(url, headers={"Authorization": f"Bearer {self.access_token}"})
        else:
            if self.email and self.api_key:
                response = requests.get(url, auth=(self.email + "/token", self.api_key))
            else:
                response = requests.get(url, headers= {"Authorization": f"Basic {self.access_token}"})

        return response

    

    
