import requests
from models.models import Document, Section
from typing import Dict, List, Optional, Tuple
import json


class ReadmeParser:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_all_docs(self) -> List[Dict]:
        categories = self.get_all_categories()

        docs = []
        for category in categories:
            slug = category["slug"]
            category_docs = self.get_docs_for_category(slug)
            docs.extend(category_docs)

        return docs

    def get_all_categories(self) -> List[Dict]:
        url = "https://dash.readme.com/api/v1/categories?perPage=100&page=1"

        response = requests.get(url, auth=(self.api_key, ""))

        return response.json()

    def get_docs_for_category(self, slug: str) -> List[Dict]:
        url = (
            f"https://dash.readme.com/api/v1/categories/{slug}/docs?perPage=100&page=1"
        )

        response = requests.get(
            url, auth=(self.api_key, ""), headers={"Accept": "application/json"}
        )

        doc_metadatas = response.json()

        docs = []

        for doc_metadata in doc_metadatas:
            doc_slug = doc_metadata["slug"]

            doc_url = f"https://dash.readme.com/api/v1/docs/{doc_slug}"

            doc_response = requests.get(
                doc_url, auth=(self.api_key, ""), headers={"Accept": "application/json"}
            )
            doc_data = doc_response.json()

            docs.append(
                {
                    "title": doc_data["title"],
                    "content": doc_data["body_html"],
                    "uri": doc_data["link_url"],
                }
            )

        return docs
