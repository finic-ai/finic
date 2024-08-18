import io
from fastapi import UploadFile
import json
from typing import List, Optional, Tuple
from models.models import (
    AppConfig,
    User,
    Workflow,
    WorkflowRun,
    Credential,
    Transformation,
    Node,
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

    async def upsert_credentials(self, credential: Credential) -> Optional[Workflow]:
        response = (
            self.supabase.table("credentials").upsert(credential.dict()).execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Credential(**row)
        return None

    async def get_workflow(self, workflow_id: str, app_id: str) -> Optional[Workflow]:
        response = (
            self.supabase.table("workflow")
            .select("*")
            .filter("id", "eq", workflow_id)
            .filter("app_id", "eq", app_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Workflow(**row)
        return None

    async def get_credentials(
        self, workflow_id: str, node_id: str, user_id: str
    ) -> Optional[str]:
        response = (
            self.supabase.table("credentials")
            .select("*")
            .filter("workflow_id", "eq", workflow_id)
            .filter("node_id", "eq", node_id)
            .filter("user_id", "eq", user_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Credential(**row)
        return None

    async def delete_workflow(
        self, workflow_id: str, app_id: str
    ) -> Optional[Workflow]:
        response = (
            self.supabase.table("workflow")
            .delete()
            .filter("id", "eq", workflow_id)
            .filter("app_id", "eq", app_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Workflow(**row)
        return None

    async def list_workflows(self, app_id: str) -> Optional[List[Workflow]]:
        response = (
            self.supabase.table("workflow")
            .select("id, app_id, name, created_at, status, nodes, edges")
            .filter("app_id", "eq", app_id)
            .execute()
        )

        if len(response.data) > 0:
            return [Workflow(**row) for row in response.data]
        return None

    async def save_workflow_run(
        self,
        workflow_run: WorkflowRun,
    ) -> Optional[WorkflowRun]:
        response = (
            self.supabase.table("workflow_run")
            .upsert(
                workflow_run.dict(),
            )
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return WorkflowRun(**row)
        return None

    async def get_workflow_run(self, workflow_id: str) -> Optional[WorkflowRun]:
        response = (
            self.supabase.table("workflow_run")
            .select("*")
            .filter("workflow_id", "eq", workflow_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return WorkflowRun(**row)
        return None

    async def get_node(
        self, app_id: str, workflow_id: str, node_id: str
    ) -> Optional[Node]:
        # Get the workflow
        workflow = await self.get_workflow(workflow_id, app_id)
        if workflow is None:
            return None

        # Get the node
        for node in workflow.nodes:
            if node.id == node_id:
                return node

        return None

    async def upsert_node(
        self, app_id: str, workflow_id: str, node: Node
    ) -> Optional[Workflow]:
        # Get the workflow
        workflow = await self.get_workflow(workflow_id, app_id)
        if workflow is None:
            return None

        # Update the node
        for i, n in enumerate(workflow.nodes):
            if n.id == node.id:
                workflow.nodes[i] = node
                break

        await self.upsert_workflow(workflow)
        return node
