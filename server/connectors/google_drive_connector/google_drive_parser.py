import requests
from typing import Dict, Any, List
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from models.models import Section
import json
from collections import deque
import re


class GoogleDriveParser:

    def __init__(self, service: Any, folder_id: str):
        self.service = service

    def get_files_by_uris(self, uris: List[str]) -> list:
        files = []
        for uri in uris:
            id = self.get_id_from_uri(uri)
            file = self.service.files().get(fileId=id, fields="id, name, webViewLink, mimeType").execute()
            files.append(file)
        return files
    
    def list_files_in_folder(self, folder_id) -> bool:
        query = f"'{folder_id}' in parents"
        results = self.service.files().list(q=query, fields="nextPageToken, files(id, name, mimeType, webViewLink)").execute()
        items = results.get("files", [])
        return items
    
    def list_all_subfolders(self, folder_id) -> List[Section]:
        folders_to_process = deque([folder_id])
        folders = []
        while folders_to_process:
            current_folder = folders_to_process.popleft()
            items = self.list_files_in_folder(current_folder)

            for item in items:
                mime_type = item.get("mimeType", "")

                if mime_type == "application/vnd.google-apps.folder":
                    folders_to_process.append(item["id"])
                    folders.append(Section(
                        id=item["id"],
                        name=item["name"],
                    ))
        return folders
    
    def get_all_files(self, folder_id) -> list:
        folders_to_process = deque([folder_id])
        files = []
        while folders_to_process:
            current_folder = folders_to_process.popleft()
            items = self.list_files_in_folder( current_folder)

            for item in items:
                mime_type = item.get("mimeType", "")

                if mime_type == "application/vnd.google-apps.folder":
                    folders_to_process.append(item["id"])
                elif mime_type in ["application/vnd.google-apps.document", "application/pdf"]:
                    # Retrieve the full metadata for the file
                    file_metadata = self.service.files().get(fileId=item["id"], fields="id, name, webViewLink, mimeType").execute()
                    files.append(file_metadata)
                else:
                    print(f"Unsupported file type: {mime_type}")
        return files
    
    def get_id_from_uri(self, uri: str):
        # Extract the file id from the url
        # the id comes after /d/ and before the next /

        id = re.search(r"/d/([^/]+)", uri).group(1)
        return id


