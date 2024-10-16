import io
from fastapi import UploadFile
import json
from typing import List, Optional, Tuple
from models.models import (
    AppConfig,
    User,
    Session,
    Browser,
    Agent
)
from supabase import create_client, Client
import os
from storage3.utils import StorageException

from io import StringIO
from bs4 import BeautifulSoup
import httpx
import datetime
import tempfile
import pdb
from dotenv import load_dotenv
import urllib.parse
import uuid

def get_file_size(file: io.BytesIO) -> int:
    return file.getbuffer().nbytes


class Database:
    def __init__(self):
        load_dotenv()
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")
        self.supabase = create_client(supabase_url, supabase_key)

    def get_config(self, bearer_token: str) -> Optional[AppConfig]:
        response = (
            self.supabase.table("user")
            .select("*")
            .filter("secret_key", "eq", bearer_token)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return AppConfig(user_id=row["id"], app_id=row["app_id"])
        return None

    def get_secret_key_for_user(self, user_id: str):
        response = (
            self.supabase.table("user")
            .select("secret_key")
            .filter("id", "eq", user_id)
            .execute()
        )
        if len(response.data) > 0:
            return response.data[0]["secret_key"]
        return None

    def get_user(self, config: AppConfig) -> Optional[User]:
        response = (
            self.supabase.table("user")
            .select("*")
            .filter("app_id", "eq", config.app_id)
            .filter("id", "eq", config.user_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return User(**row)
        return None

    def get_browser(self, config: AppConfig, browser_id: str) -> Optional[str]:
        try:
            response = (
                self.supabase.table("browser")
                .select("*")
                .filter("id", "eq", browser_id)
                .filter("app_id", "eq", config.app_id)
                .execute()
            )
            if len(response.data) > 0:
                return Browser(**response.data[0])
            return None
        except Exception as e:
            print(e)
            return None
            

    def upsert_browser(self, browser: Browser) -> Optional[Browser]:
        response = (
            self.supabase.table("browser")
            .upsert(browser.dict())
            .execute()
        )
        if len(response.data) > 0:
            return Browser(**response.data[0])
        return None
    
    def get_session(self, session_id: str, app_id: str) -> Optional[Session]:
        response = (
            self.supabase.table("session")
            .select("*")
            .filter("id", "eq", session_id)
            .filter("app_id", "eq", app_id)
            .execute()
        )
        if len(response.data) > 0:
            return Session(**response.data[0])
        return None

    def upsert_session(self, session: Session) -> Optional[Session]:
        response = (
            self.supabase.table("session")
            .upsert(session.model_dump(mode="json"))
            .execute()
        )
        if len(response.data) > 0:
            return Session(**response.data[0])
        return None
    
    def get_session_recording_upload_link(self, session: Session) -> Optional[str]:
        response = (
            self.supabase.storage.get_bucket("session_recordings")
            .create_signed_upload_url(f"{session.app_id}/{session.id}.webm")
        )
        if response:
            return response["signed_url"]
        return None
    
    def get_session_recording_download_link(self, session: Session) -> Optional[str]:
        response = (
            self.supabase.storage.get_bucket("session_recordings")
            .create_signed_url(f"{session.app_id}/{session.id}.webm", expires_in=60)
        )
        if response:
            return response["signedURL"]
        return None
    
    def get_session_file_upload_link(self, session: Session, file_name: str) -> Optional[str]:
        response = (
            self.supabase.storage.get_bucket("session_files")
            .create_signed_upload_url(f"{session.app_id}/{session.id}/{file_name}", expires_in=60)
        )
        if response:
            return response["signed_url"]
        return None
    
    def get_session_file_download_links(self, session: Session) -> List[str]:
        # Get a download url for each file in the session
        response = (
            self.supabase.storage.get_bucket("session_files")
            .list(f"{session.app_id}/{session.id}")
        )
        signed_urls = []
        for file in response:
            signed_urls.append(
                self.supabase.storage.get_bucket("session_files")
                .create_signed_url(f"{session.app_id}/{session.id}/{file['name']}", expires_in=60)
            )
        return signed_urls
    
    def get_agent_upload_link(self, agent: Agent) -> Optional[str]:
        # Signed upload link

        syncbucket = self.supabase.storage.get_bucket("agents")
        _path = syncbucket._get_final_path(f"{agent.app_id}/{agent.id}.zip")
        response = syncbucket._request("POST", f"/object/upload/sign/{_path}", {"x-upsert": "true"})
        data = response.json()
        full_url: urllib.parse.ParseResult = urllib.parse.urlparse(
            str(syncbucket._client.base_url) + data["url"]
        )
        query_params = urllib.parse.parse_qs(full_url.query)
        if not query_params.get("token"):
            raise StorageException("No token sent by the API")
        return full_url.geturl()

        # response = (
        #     self.supabase.storage.get_bucket("agents").create_signed_upload_url(f"{agent.app_id}/{agent.id}.zip")
        # )
        # if response and "signed_url" in response:
        #     return response["signed_url"]
        # return None

    def get_agent_download_link(self, agent: Agent) -> Optional[str]:
        response = (
            self.supabase.storage.get_bucket("agents").create_signed_url(f"{agent.app_id}/{agent.id}.zip", expires_in=60)
        )
        if response:
            print(response)
            return response["signedURL"]
        return None
    
    def upsert_agent(self, agent: Agent) -> Optional[Agent]:
        response = (
            self.supabase.table("agent")
            .upsert(agent.dict())
            .execute()
        )
        if len(response.data) > 0:
            return Agent(**response.data[0])
        return None
    
    def get_agent(self, agent_id: str, app_id: str) -> Optional[Agent]:
        response = (
            self.supabase.table("agent")
            .select("*")
            .filter("id", "eq", agent_id)
            .filter("app_id", "eq", app_id)
            .execute()
        )
        if len(response.data) > 0:
            return Agent(**response.data[0])
        return None
    
    def list_agents(self, app_id: str) -> List[Agent]:
        print("app_id", app_id)
        response = (
            self.supabase.table("agent")
            .select("*")
            .filter("app_id", "eq", app_id)
            .execute()
        )
        return [Agent(**row) for row in response.data]
    
    def get_trace_upload_link(self, app_id: str) -> Optional[str]:
        trace_id = str(uuid.uuid4())
        response = (
            self.supabase.storage.get_bucket("traces")
            .create_signed_upload_url(f"{app_id}/{trace_id}.zip", expires_in=60)
        )
        if response:
            return response["signed_url"]
        return None
    
    def list_sessions(self, agent_id: str, app_id: str) -> List[Session]:
        response = (
            self.supabase.table("session")
            .select("*")
            .filter("agent_id", "eq", agent_id)
            .filter("app_id", "eq", app_id)
            .execute()
        )
        
        return [Session(**row) for row in response.data]
