import io
from typing import List, Optional
from models.models import (
    AppConfig,
    User,
    Workflow,
    WorkflowRun,
    Credential,
)
from supabase import create_client, Client
import os
import json
import datetime


def get_supabase_timestamp(date: Optional[datetime.datetime] = None):
    supabase_format = "%Y-%m-%dT%H:%M:%S.%f%z"
    if date:
        return date.strftime(supabase_format)
    return datetime.datetime.now().strftime(supabase_format)


def get_file_size(file: io.BytesIO) -> int:
    return file.getbuffer().nbytes


class Database:
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        self.supabase = create_client(supabase_url, supabase_key)

    def get_config(self, bearer_token: str) -> Optional[AppConfig]:
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

    def upsert_workflow(self, workflow: Workflow) -> Optional[Workflow]:
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

    def get_workflow(self, workflow_id: str, app_id: str) -> Optional[Workflow]:
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

    def list_workflows(self, app_id: str) -> Optional[List[Workflow]]:
        response = (
            self.supabase.table("workflow")
            .select("id, app_id, name, created_at, status, nodes, edges")
            .filter("app_id", "eq", app_id)
            .execute()
        )

        if len(response.data) > 0:
            return [Workflow(**row) for row in response.data]
        return None

    def save_workflow_run(self, workflow_run: WorkflowRun) -> Optional[WorkflowRun]:
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

    def get_workflow_run(self, workflow_id: str) -> Optional[WorkflowRun]:
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

    def get_credentials(
        self, workflow_id: str, node_id: str, app_id: str
    ) -> Optional[str]:
        response = (
            self.supabase.table("credentials")
            .select("*")
            .filter("workflow_id", "eq", workflow_id)
            .filter("node_id", "eq", node_id)
            .filter("app_id", "eq", app_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            if "credentials" in row and type(row["credentials"]) == str:
                row["credentials"] = json.loads(row["credentials"])
            return Credential(**row)
        return None
