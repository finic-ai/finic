import requests
from enum import Enum
from typing import List, Optional, Dict

class ConnectorId(Enum):
    notion = "notion"
    confluence = "confluence"
    zendesk = "zendesk"
    gdrive = "gdrive"
    slack = "slack"

class Psychic:
    def __init__(self, secret_key: str):
        self.api_url = "https://sidekick-ezml2kwdva-uc.a.run.app/"
        self.secret_key = secret_key

    def get_documents(self, connector_id: ConnectorId, account_id: str):
        response = requests.post(
            self.api_url + "get-documents",
            json={
                "connector_id": connector_id.value,
                "account_id": account_id,
            },
            headers={
                'Authorization': 'Bearer ' + self.secret_key,
                'Accept': 'application/json'
            }
        )
        if response.status_code == 200:
            documents = response.json()["documents"]
            return documents
        else:
            return None
        
    def get_connections(self, connector_id: Optional[ConnectorId] = None, account_id: Optional[str] = None):
        filter = {}

        if connector_id is not None:
            filter["connector_id"] = connector_id.value
        if account_id is not None:
            filter["account_id"] = account_id

        response = requests.post(
            self.api_url + "get-connections",
            json={
                "filter": filter,
            },
            headers={
                'Authorization': 'Bearer ' + self.secret_key,
                'Accept': 'application/json'
            }
        )
        if response.status_code == 200:
            documents = response.json()["connections"]
            return documents
        else:
            return None
        
    def get_conversations(self, connector_id: ConnectorId, account_id: str, oldest_timestamp: Optional[int] = None):
        body = {
            "connector_id": connector_id.value,
            "account_id": account_id,
        }
        if oldest_timestamp is not None:
            body["oldest_timestamp"] = oldest_timestamp

        response = requests.post(
            self.api_url + "get-conversations",
            json=body,
            headers={
                'Authorization': 'Bearer ' + self.secret_key,
                'Accept': 'application/json'
            }
        )
        if response.status_code == 200:
            messages = response.json()["messages"]
            return messages
        else:
            return None