import io
from fastapi import UploadFile
import json
from typing import List, Optional, Tuple
from models.models import (
    AppConfig,
    User,
    Agent,
    Execution,
    FinicSelector,
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


def get_file_size(file: io.BytesIO) -> int:
    return file.getbuffer().nbytes


class Database:
    def __init__(self):
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

    def upsert_agent(self, agent: Agent) -> Optional[Agent]:
        payload = agent.dict()
        # Remove created_at field
        payload.pop("created_at", None)
        response = (
            self.supabase.table("agent")
            .upsert(
                payload,
            )
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Agent(**row)
        return None

    def get_agent(self, config: AppConfig, id: str) -> Optional[Agent]:
        response = (
            self.supabase.table("agent")
            .select("*")
            .filter("app_id", "eq", config.app_id)
            .filter("id", "eq", id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Agent(**row)
        return None

    def get_user(self, config: AppConfig) -> Optional[Agent]:
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

    def list_agents(self, config: AppConfig) -> List[Agent]:
        response = (
            self.supabase.table("agent")
            .select("*")
            .filter("app_id", "eq", config.app_id)
            .execute()
        )
        return [Agent(**row) for row in response.data]

    def list_executions(
        self,
        config: AppConfig,
        finic_agent_id: str = None,
        user_defined_agent_id: str = None,
    ) -> List[Execution]:
        query = (
            self.supabase.table("execution")
            .select("*")
            .filter("app_id", "eq", config.app_id)
        )
        if finic_agent_id:
            query = query.filter("finic_agent_id", "eq", finic_agent_id)
        if user_defined_agent_id:
            query = query.filter("user_defined_agent_id", "eq", user_defined_agent_id)
        response = query.execute()
        return [Execution(**row) for row in response.data]

    def get_execution(
        self, config: AppConfig, finic_agent_id: str, execution_id: str
    ) -> Optional[Execution]:
        response = (
            self.supabase.table("execution")
            .select("*")
            .filter("app_id", "eq", config.app_id)
            .filter("finic_agent_id", "eq", finic_agent_id)
            .filter("id", "eq", execution_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Execution(**row)
        return None

    def upsert_execution(self, execution: Execution) -> Optional[Execution]:
        json_payload = execution.json()
        payload = json.loads(json_payload)

        response = self.supabase.table("execution").upsert(payload).execute()
        if len(response.data) > 0:
            row = response.data[0]
            return Execution(**row)
        return None
    
    def get_selectors(self, config: AppConfig, agent_id: str, url: str, selector_ids: Optional[List[str]] = None) -> Optional[List[FinicSelector]]:
        query = (
            self.supabase.table("selector")
            .select("*")
            .filter("app_id", "eq", config.app_id)
            .filter("agent_id", "eq", agent_id)
            .filter("url", "eq", url)
        )
        if selector_ids:
            query = query.filter("id", "in", selector_ids)
        
        response = query.execute()
        return [FinicSelector(**row) for row in response.data]
