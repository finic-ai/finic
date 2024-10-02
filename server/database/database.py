import io
from fastapi import UploadFile
import json
from typing import List, Optional, Tuple
from models.models import (
    AppConfig,
    User,
    Session,
    Browser
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

    def upsert_session(self, session: Session) -> Optional[Session]:
        response = (
            self.supabase.table("session")
            .upsert(session.dict())
            .execute()
        )
        if len(response.data) > 0:
            return Session(**response.data[0])
        return None

    