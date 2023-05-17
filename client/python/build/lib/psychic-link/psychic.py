import requests
from enum import Enum

class ConnectorId(Enum):
    notion = "notion"
    confluence = "confluence"
    zendesk = "zendesk"
    gdrive = "gdrive"

class Psychic:
    def __init__(self, secret_key: str):
        self.api_url = "https://sidekick-ezml2kwdva-uc.a.run.app/"
        self.secret_key = secret_key

    def get_documents(self, connector_id: ConnectorId, connection_id: str):
        response = requests.post(
            self.api_url + "get-documents",
            json={
                "connector_id": connector_id.value,
                "connection_id": connection_id,
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