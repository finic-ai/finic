import io
from fastapi import UploadFile
from typing import List, Optional, Tuple, Dict
from models.models import (
    AppConfig,
    User,
    FinicEnvironment,
    Agent,
    Execution,
    ExecutionStatus,
    ExecutionAttempt,
    ExecutionLog,
    LogSeverity,
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
import uuid
from google.cloud import logging_v2


class AgentRunner:
    def __init__(
        self,
    ):
        service_account_info = json.loads(os.getenv("GCLOUD_SERVICE_ACCOUNT"))
        self.credentials = service_account.Credentials.from_service_account_info(
            service_account_info
        )
        self.project = os.getenv("GCLOUD_PROJECT")
        self.location = os.getenv("GCLOUD_LOCATION")
        self.logging_client = logging_v2.Client(credentials=self.credentials)

    async def start_agent(
        self, secret_key: str, agent: Agent, input: Dict
    ) -> Execution:
        client = run_v2.JobsClient(credentials=self.credentials)
        execution_id = str(uuid.uuid4())
        request = run_v2.RunJobRequest(
            name=f"projects/{self.project}/locations/{self.location}/jobs/{Agent.get_cloud_job_id(agent)}",
            overrides={
                "container_overrides": [
                    {
                        "env": [
                            {"name": "FINIC_ENV", "value": FinicEnvironment.PROD.value},
                            {"name": "FINIC_INPUT", "value": json.dumps(input)},
                            {"name": "FINIC_API_KEY", "value": secret_key},
                            {"name": "FINIC_AGENT_ID", "value": agent.id},
                            {"name": "FINIC_EXECUTION_ID", "value": execution_id},
                        ]
                    }
                ]
            },
        )
        operation = client.run_job(request)

        execution_path = operation.metadata.name
        cloud_provider_id = execution_path.split("/")[-1]
        print(f"Started execution: {execution_id}")
        return Execution(
            id=execution_id,
            finic_agent_id=agent.finic_id,
            user_defined_agent_id=agent.id,
            app_id=agent.app_id,
            cloud_provider_id=cloud_provider_id,
            status=ExecutionStatus.running,
            start_time=datetime.datetime.now(),
        )

    async def update_execution(
        self,
        agent: Agent,
        execution: Execution,
        attempt: ExecutionAttempt,
        results: Dict,
    ):

        filters = [
            f'resource.type ="cloud_run_job"',
            f'resource.labels.job_name="{Agent.get_cloud_job_id(agent)}"',
            f'labels."run.googleapis.com/execution_name"="{execution.cloud_provider_id}"',
            f'labels."run.googleapis.com/task_attempt"="{attempt.attempt_number}"',
        ]
        attempt.logs = []

        for entry in self.logging_client.list_entries(
            resource_names=[f"projects/{self.project}"],
            filter_=" ".join(filters),
            order_by=logging_v2.ASCENDING,
        ):
            severity = LogSeverity.from_cloud_logging_severity(entry.severity)
            if severity is None:
                continue
            attempt.logs.append(
                ExecutionLog(
                    severity=severity,
                    message=str(entry.payload),
                )
            )

        # Add the attempt to the execution
        execution.attempts.append(attempt)

        # Make sure the list is deduped and ordered by attempt number
        execution.attempts = list(
            sorted(
                list(
                    {
                        attempt.attempt_number: attempt
                        for attempt in execution.attempts
                    }.values()
                ),
                key=lambda x: x.attempt_number,
            )
        )

        # Update the execution status
        if attempt.success:
            execution.status = ExecutionStatus.successful
            execution.end_time = datetime.datetime.now()
            execution.results = results
        elif len(execution.attempts) == agent.num_retries:
            execution.status = ExecutionStatus.failed
            execution.end_time = datetime.datetime.now()
        else:
            execution.status = ExecutionStatus.running

        return execution
