import requests
from typing import Dict, Any, List, Optional
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from models.models import Section, SectionType
import json
from collections import deque
import re


class GoogleDriveParser:
    def __init__(self, service: Any):
        self.service = service

    def get_files_by_uris(self, uris: List[str]) -> list:
        files = []
        for uri in uris:
            id = self.get_id_from_uri(uri)
            try:
                file = (
                    self.service.files()
                    .get(
                        fileId=id,
                        fields="id, name, webViewLink, mimeType",
                        supportsAllDrives=True,
                    )
                    .execute()
                )
                files.append(file)
            except Exception as e:
                print(e)
        return files

    def get_file_by_id(self, id: str) -> Any:
        try:
            file = (
                self.service.files()
                .get(
                    fileId=id,
                    fields="id, name, webViewLink, mimeType",
                    supportsAllDrives=True,
                )
                .execute()
            )
            return file
        except Exception as e:
            print(e)
            return None

    def list_files_in_folder(self, folder_id: Optional[str]) -> list:
        try:
            if not folder_id:
                results = (
                    self.service.files()
                    .list(
                        fields="nextPageToken, files(id, name, mimeType, webViewLink)",
                        supportsAllDrives=True,
                    )
                    .execute()
                )
            else:
                query = f"'{folder_id}' in parents"
                results = (
                    self.service.files()
                    .list(
                        q=query,
                        fields="nextPageToken, files(id, name, mimeType, webViewLink)",
                        supportsAllDrives=True,
                        includeItemsFromAllDrives=True,
                    )
                    .execute()
                )
            items = results.get("files", [])
            return items
        except Exception as e:
            print(e)
            return []

    def list_all_subfolders(self) -> List[Section]:
        folders_to_process = deque([])
        folders = []

        # get all top-level items
        items = self.list_files_in_folder(None)
        for item in items:
            if item.get("mimeType", "") == "application/vnd.google-apps.folder":
                folder = Section(
                    id=item["id"],
                    name=item["name"],
                    type=SectionType.folder,
                    children=[],
                )
                folders_to_process.append(folder)
                folders.append(folder)
            elif item.get("mimeType", "") in [
                "application/vnd.google-apps.document",
                "application/pdf",
            ]:
                folders.append(
                    Section(
                        id=item["id"],
                        name=item["name"],
                        type=SectionType.document,
                    )
                )

        while folders_to_process:
            current_folder = folders_to_process.popleft()
            items = self.list_files_in_folder(current_folder.id)

            for item in items:
                mime_type = item.get("mimeType", "")

                if mime_type == "application/vnd.google-apps.folder":
                    folder = Section(
                        id=item["id"],
                        name=item["name"],
                        type=SectionType.folder,
                        children=[],
                    )
                    current_folder.children.append(folder)
                    folders_to_process.append(folder)

                elif mime_type in [
                    "application/vnd.google-apps.document",
                    "application/pdf",
                ]:
                    current_folder.children.append(
                        Section(
                            id=item["id"],
                            name=item["name"],
                            type=SectionType.document,
                        )
                    )

        return folders

    def get_all_files(self, section: Section) -> list:
        if section.type == SectionType.folder:
            folder_id = section.id
        else:
            file = self.get_file_by_id(section.id)
            if not file:
                return []
            return [file]

        folders_to_process = deque([folder_id])
        files = []
        while folders_to_process:
            current_folder = folders_to_process.popleft()
            items = self.list_files_in_folder(current_folder)

            for item in items:
                mime_type = item.get("mimeType", "")

                if mime_type == "application/vnd.google-apps.folder":
                    folders_to_process.append(item["id"])
                elif mime_type in [
                    "application/vnd.google-apps.document",
                    "application/pdf",
                ]:
                    # Retrieve the full metadata for the file
                    file_metadata = (
                        self.service.files()
                        .get(
                            fileId=item["id"],
                            fields="id, name, webViewLink, mimeType",
                            supportsAllDrives=True,
                        )
                        .execute()
                    )
                    files.append(file_metadata)
                else:
                    print(f"Unsupported file type: {mime_type}")
        return files

    def get_id_from_uri(self, uri: str):
        # Extract the file id from the url
        # the id comes after /d/ and before the next /

        id = re.search(r"/d/([^/]+)", uri).group(1)
        return id
