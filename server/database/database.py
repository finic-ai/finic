import io
from fastapi import UploadFile
from typing import List, Optional, Tuple
from models.models import (
    AppConfig,
    User,
    Business,
)
from supabase import create_client, Client
import os
from storage3.utils import StorageException
import csv
import json
from io import StringIO
import asyncio
import requests
import openai
from bs4 import BeautifulSoup
import pandas as pd
import httpx
import datetime


def get_supabase_timestamp(date: Optional[datetime.datetime] = None):
    supabase_format = "%Y-%m-%dT%H:%M:%S.%f%z"
    if date:
        return date.strftime(supabase_format)
    return datetime.datetime.now().strftime(supabase_format)


class Database:
    def __init__(self):
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")
        self.supabase = create_client(supabase_url, supabase_key)

    async def get_config(self, bearer_token: str) -> Optional[AppConfig]:
        response = (
            self.supabase.table("lending_users")
            .select("*")
            .filter("secret_key", "eq", bearer_token)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return AppConfig(user_id=row["id"])
        return None

    async def get_user(self, app_id: str) -> Optional[User]:
        print("app_id", app_id)
        response = (
            self.supabase.table("lending_users")
            .select("*")
            .filter("app_id", "eq", app_id)
            .execute()
        )
        print("response", response)
        if len(response.data) > 0:
            row = response.data[0]
            return User(**row)
        return None

    async def get_user_by_id(self, user_id: Optional[str]) -> Optional[User]:
        if not user_id:
            return None
        response = (
            self.supabase.table("lending_users")
            .select("*")
            .filter("id", "eq", user_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return User(**row)
        return None

    async def set_user_fields(
        self,
        config: AppConfig,
        completed_onboarding: Optional[bool] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        type: Optional[str] = None,
    ) -> Optional[User]:
        payload = {
            "first_name": first_name,
            "last_name": last_name,
            "type": type,
            "completed_onboarding": completed_onboarding,
        }
        response = (
            self.supabase.table("lending_users")
            .update(
                payload,
            )
            .filter("id", "eq", config.user_id)
            .execute()
        )
        print(response)
        if len(response.data) > 0:
            return User(**response.data[0])
        return None

    async def upsert_business(self, business: Business) -> Optional[Business]:
        response = (
            self.supabase.table("businesses")
            .upsert(
                business.dict(),
            )
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Business(**row)
        return None
