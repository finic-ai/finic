import os
import requests
from dotenv import load_dotenv
import io
from typing import Optional

load_dotenv()

SERVER_URL = os.getenv("SERVER_URL")
if not SERVER_URL:
    raise ValueError("SERVER_URL is not set")

class FinicClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = SERVER_URL

    def get_browser_state_download_url(self, browser_id: str):
        response = requests.get(
            f"{self.base_url}/browser-state-download-url/{browser_id}",
            headers={"Authorization": f"Bearer {self.api_key}"},
        )
        response.raise_for_status()
        response_json = response.json()

        download_url = response_json["download_url"]
        encryption_key = response_json["encryption_key"]
        return download_url, encryption_key

    def get_browser_state_upload_url(self, browser_id: str):
        response = requests.get(
            f"{self.base_url}/browser-state-upload-url/{browser_id}",
            headers={"Authorization": f"Bearer {self.api_key}"},
        )
        response.raise_for_status()
        response_json = response.json()

        upload_url = response_json["upload_url"]
        encryption_key = response_json["encryption_key"]
        return upload_url, encryption_key
        
    def upload_browser_state(self, upload_url: str, encrypted_zip_buffer: io.BytesIO):
        print(f"Uploading browser state to {upload_url}")
        response = requests.put(
            upload_url,
            data=encrypted_zip_buffer,
            headers={"Content-Type": "application/zip"},
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