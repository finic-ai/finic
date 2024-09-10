import io
from fastapi import UploadFile
import json
from typing import List, Optional, Tuple
from models.models import (
    AppConfig,
    User,
    Job,
    Execution,
)
from supabase import create_client, Client
import os
from storage3.utils import StorageException

from io import StringIO
from bs4 import BeautifulSoup
import pandas as pd
import httpx
import datetime
from pypdf import PdfWriter, PdfReader
import tempfile
import pdb


def get_supabase_timestamp(date: Optional[datetime.datetime] = None):
    supabase_format = "%Y-%m-%dT%H:%M:%S.%f%z"
    if date:
        return date.strftime(supabase_format)
    return datetime.datetime.now().strftime(supabase_format)


def get_file_size(file: io.BytesIO) -> int:
    return file.getbuffer().nbytes


class Database:
    def __init__(self):
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")
        self.supabase = create_client(supabase_url, supabase_key)

    async def get_config(self, bearer_token: str) -> Optional[AppConfig]:
        response = (
            self.supabase.table("user")
            .select("*")
            .filter("secret_key", "eq", bearer_token)
            .execute()
        )
        print("response", response)
        print("response.data", response.data)
        if len(response.data) > 0:
            row = response.data[0]
            return AppConfig(user_id=row["id"], app_id=row["app_id"])
        return None

    async def get_secret_key_for_user(self, user_id: str):
        response = (
            self.supabase.table("user")
            .select("secret_key")
            .filter("id", "eq", user_id)
            .execute()
        )
        if len(response.data) > 0:
            return response.data[0]["secret_key"]
        return None

    async def upsert_job(self, job: Job) -> Optional[Job]:
        response = (
            self.supabase.table("job")
            .upsert(
                job.dict(),
            )
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Job(**row)
        return None

    async def get_job(self, config: AppConfig, user_defined_id: str) -> Optional[Job]:
        response = (
            self.supabase.table("job")
            .select("*")
            .filter("app_id", "eq", config.app_id)
            .filter("user_defined_id", "eq", user_defined_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Job(**row)
        return None

    async def list_jobs(self, config: AppConfig) -> List[Job]:
        response = (
            self.supabase.table("job")
            .select("*")
            .filter("app_id", "eq", config.app_id)
            .execute()
        )
        return [Job(**row) for row in response.data]

    async def list_executions(self, config: AppConfig, job_id: str) -> List[Execution]:
        response = (
            self.supabase.table("execution")
            .select("*")
            .filter("app_id", "eq", config.app_id)
            .filter("job_id", "eq", job_id)
            .execute()
        )
        return [Execution(**row) for row in response.data]

    async def get_execution(
        self, config: AppConfig, job_id: str, execution_id: str
    ) -> Optional[Execution]:
        response = (
            self.supabase.table("execution")
            .select("*")
            .filter("app_id", "eq", config.app_id)
            .filter("job_id", "eq", job_id)
            .filter("id", "eq", execution_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Execution(**row)
        return None
