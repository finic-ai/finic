import os
import requests
from dotenv import load_dotenv
import io
from typing import Dict, Optional
load_dotenv()

SERVER_URL = os.getenv("SERVER_URL")
if not SERVER_URL:
    raise ValueError("SERVER_URL is not set")

class FinicClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = SERVER_URL

    def get_browser_state(self, browser_id: str):
        response = requests.get(
            f"{self.base_url}/browser-state/{browser_id}",
            headers={"Authorization": f"Bearer {self.api_key}"},
        )
        response.raise_for_status()
        response_json = response.json()
        if response_json:
            return response_json["state"]
        return None
        
    def upsert_browser_state(self, browser_id: str, state: Dict):
        response = requests.post(
            f"{self.base_url}/browser-state/{browser_id}",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json=state,
        )
        response.raise_for_status()

    def start_session(self, browser_id: Optional[str] = None):
        response = requests.post(
            f"{self.base_url}/start-session",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={"browser_id": browser_id},
        )
        response.raise_for_status()
        response_json = response.json()
        return response_json["session_id"]