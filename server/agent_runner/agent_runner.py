import io
from fastapi import UploadFile
from typing import List, Optional, Tuple, Dict
from models.models import (
    AppConfig,
    User,
)
from supabase import create_client, Client
import os
from storage3.utils import StorageException

from io import StringIO
from bs4 import BeautifulSoup
import pandas as pd
import httpx
import datetime
import tempfile
import pdb
from collections import deque
from database import Database
import json
from google.cloud import run_v2
from google.oauth2 import service_account


class AgentRunner:
    def __init__(self, db: Database, config: AppConfig):
        self.db = db
        self.config = config
        service_account_info = json.loads(os.getenv("GCLOUD_SERVICE_ACCOUNT"))
        self.credentials = service_account.Credentials.from_service_account_info(
            service_account_info
        )

    async def start_agent(self, workflow_id: str):
        client = run_v2.AgentsClient(credentials=self.credentials)
        project = os.getenv("GCLOUD_PROJECT")
        location = os.getenv("GCLOUD_LOCATION")
        agent = os.getenv("GCLOUD_JOB_NAME")
        secret_key = await self.db.get_secret_key_for_user(self.config.user_id)
        request = run_v2.RunAgentRequest(
            name=f"projects/{project}/locations/{location}/agents/{agent}",
            overrides={
                "container_overrides": [
                    {
                        "env": [
                            {"name": "WORKFLOW_ID", "value": workflow_id},
                            {"name": "SECRET_KEY", "value": secret_key},
                        ]
                    }
                ]
            },
        )
        operation = client.run_agent(request)
        print(f"Started agent: {operation}")
        # update the workflow run status to running

    #     run = WorkflowRun(
    #         workflow_id=workflow_id,
    #         app_id=self.config.app_id,
    #         status=WorkflowRunStatus.running,
    #     )
    #     await self.db.save_workflow_run(
    #         workflow_run=run,
    #     )
    #     return run

    # async def get_run_status(self, workflow_id: str) -> WorkflowRun:
    #     run = await self.db.get_workflow_run(workflow_id, self.config.app_id)
    #     return run
