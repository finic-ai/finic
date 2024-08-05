import io
from fastapi import UploadFile
from typing import List, Optional, Tuple
from models.models import (
    AppConfig,
    User,
    Workflow,
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
            self.supabase.table("lending_users")
            .select("*")
            .filter("secret_key", "eq", bearer_token)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return AppConfig(user_id=row["id"])
        return None

    async def upsert_workflow(self, workflow: Workflow) -> Optional[Workflow]:
        response = (
            self.supabase.table("workflow")
            .upsert(
                workflow.dict(),
            )
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Workflow(**row)
        return None

    async def get_workflow(
        self, config: AppConfig, workflow_id: str
    ) -> Optional[Workflow]:
        response = (
            self.supabase.table("workflow")
            .select("*")
            .filter("id", "eq", workflow_id)
            .filter("app_id", "eq", config.app_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Workflow(**row)
        return None
