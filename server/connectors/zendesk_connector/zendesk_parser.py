from typing import Dict, List, Optional, Tuple
from models.models import Section, SectionType
import requests
import yaml


class Ticket:
    def __init__(self, subject, description, timestamp, status, comments):
        self.subject = subject
        self.description = description
        self.timestamp = timestamp
        self.status = status
        self.comments = comments


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
            api_url = (
                f"https://{self.subdomain}.zendesk.com/api/v2/help_center/articles/{id}"
            )
            response = self.call_zendesk_api(api_url)
            if response.status_code != 200:
                print(
                    f"Error: Unable to fetch article. Status code: {response.status_code}"
                )
                return []
            article = response.json()["article"]
            articles.append(article)

        return articles

    def get_all_articles(self, section_id: Optional[str] = None) -> list:
        articles = []
        if section_id:
            base_url = f"https://{self.subdomain}.zendesk.com/api/v2/help_center/sections/{section_id}/articles.json"
        else:
            base_url = (
                f"https://{self.subdomain}.zendesk.com/api/v2/help_center/articles.json"
            )

        while base_url:
            response = self.call_zendesk_api(base_url)
            if response.status_code != 200:
                print(
                    f"Error: Unable to fetch articles. Status code: {response.status_code}"
                )
                return []

            data = response.json()
            articles.extend(data["articles"])
            base_url = data["next_page"]

        return articles

    def get_all_tickets(
        self, section_id: Optional[str] = None, cursor: Optional[str] = None
    ) -> Tuple[list, Optional[str]]:
        if cursor:
            base_url = cursor
        else:
            base_url = f"https://{self.subdomain}.zendesk.com/api/v2/tickets.json"

        response = self.call_zendesk_api(base_url)
        if response.status_code != 200:
            print(
                f"Error: Unable to fetch articles. Status code: {response.status_code}"
            )
            return [], None  # Return a tuple of an empty list and None

        data = response.json()
        raw_tickets = data["tickets"]
        next_page = data["next_page"]

        parsed_tickets = []
        for ticket in raw_tickets:
            title = ticket["subject"]
            uri = ticket["url"]
            customer_id = ticket["requester_id"]

            content_ison = {
                "subject": ticket["subject"],
                "description": ticket["description"],
                "status": ticket["status"],
            }

            comments = self.get_ticket_comments(ticket["id"])
            parsed_comments = []
            # the first comment is just the description of the ticket so we skip it
            if len(comments) > 1:
                for comment in comments[1:]:
                    parsed_comments.append(
                        {
                            "author": "Customer"
                            if comment["author_id"] == customer_id
                            else "Agent",
                            "content": comment["body"],
                        }
                    )
            content_ison["comments"] = parsed_comments
            content_yaml = yaml.dump(content_ison, sort_keys=False)

            parsed_tickets.append(
                {
                    "title": title,
                    "uri": uri,
                    "content": content_yaml,
                }
            )

        return parsed_tickets, next_page
        
    def get_ticket_comments(self, ticket_id: str) -> list:
        base_url = f"https://{self.subdomain}.zendesk.com/api/v2/tickets/{ticket_id}/comments.json"
        response = self.call_zendesk_api(base_url)
        if response.status_code != 200:
            err = response.json()
            print(f"Error: Unable to fetch ticket comments. Status code: {err}")
            return []
        data = response.json()
        return data["comments"]

    def list_sections(self) -> List[Section]:
        base_url = (
            f"https://{self.subdomain}.zendesk.com/api/v2/help_center/sections.json"
        )
        response = self.call_zendesk_api(base_url)
        if response.status_code != 200:
            print(
                f"Error: Unable to fetch sections. Status code: {response.status_code}"
            )
            return []
        data = response.json()
        return [
            Section(
                id=section["id"],
                name=section["name"],
                type=SectionType.folder,
                children=[],
            )
            for section in data["sections"]
        ]

    def get_id_from_uri(self, uri: str) -> str:
        id = uri.split("/")[-1]
        # If there is a - in the id we want to get the first part of the id
        if "-" in id:
            id = id.split("-")[0]
        return id

    def call_zendesk_api(self, url):
        if self.is_oauth:
            response = requests.get(
                url, headers={"Authorization": f"Bearer {self.access_token}"}
            )
        else:
            if self.email and self.api_key:
                response = requests.get(url, auth=(self.email + "/token", self.api_key))
            else:
                response = requests.get(
                    url, headers={"Authorization": f"Basic {self.access_token}"}
                )

        return response
