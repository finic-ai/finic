import io
from fastapi import UploadFile
from typing import List, Optional, Tuple
from models.models import AppConfig, User, Business, Lender
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
    ) -> Optional[User]:
        payload = {
            "first_name": first_name,
            "last_name": last_name,
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

    async def get_businesses_for_user(self, user_id: str) -> List[Business]:
        response = (
            self.supabase.table("businesses")
            .select("*")
            .filter("borrower_id", "eq", user_id)
            .execute()
        )
        return [Business(**row) for row in response.data]

    async def get_lenders(
        self, sort_by, descending: bool = False, limit: int = 3
    ) -> List[Lender]:
        response = (
            self.supabase.table("lenders")
            .select("*")
            .order(sort_by, desc=descending)
            .filter("active", "eq", True)
            .limit(limit)
            .execute()
        )

        return [Lender(**row) for row in response.data]

    async def get_lenders_by_naics_code(
        self, naics_code: int, sort_by: str, descending: bool = False
    ) -> List[Lender]:
        # get the rows from lenders_naics_stats table, filter by naics code, sort by the sort_by column
        # then join with the lenders table to get the lender details

        response = (
            self.supabase.table("lenders_naics_stats")
            .select("*, lenders(id, name, type, website, contact_name, contact_email)")
            .filter("naics", "eq", naics_code)
            .filter("lenders.active", "eq", True)
            .order(sort_by, desc=descending)
            .execute()
        )

        flattened_data = []
        for item in response.data:
            if not item or not item.get("lenders"):
                continue
            flat_item = {
                **item,
                **item.pop("lenders"),
            }  # This merges the dictionary from 'lenders' into the main dictionary
            flat_item["avg_interest_rate_in_sector"] = item["mean_interest_rate"]
            flat_item["num_loans_in_sector"] = item["count"]
            flattened_data.append(flat_item)

        return [Lender(**row) for row in flattened_data]
