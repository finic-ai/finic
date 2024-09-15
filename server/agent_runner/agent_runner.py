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
import pytz
import asyncio


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
            start_time=datetime.datetime.now(tz=pytz.timezone("US/Pacific")),
        )

    def _get_logs_for_execution(
        self, execution: Execution, agent: Agent, attempt_number: int
    ) -> List[ExecutionLog]:
        print(execution.cloud_provider_id)
        print(attempt_number)
        filters = [
            f'resource.type ="cloud_run_job"',
            f'resource.labels.job_name="{Agent.get_cloud_job_id(agent)}"',
            f'labels."run.googleapis.com/execution_name"="{execution.cloud_provider_id}"',
            f'labels."run.googleapis.com/task_attempt"="{attempt_number}"',
        ]
        logs = []
        for entry in self.logging_client.list_entries(
            resource_names=[f"projects/{self.project}"],
            filter_=" ".join(filters),
            order_by=logging_v2.ASCENDING,
        ):
            severity = LogSeverity.from_cloud_logging_severity(entry.severity)
            if severity is None:
                print(f"Unknown severity: {entry.severity}")
                continue
            logs.append(
                ExecutionLog(
                    severity=severity,
                    message=str(entry.payload),
                    timestamp=entry.timestamp,
                )
            )
        return logs

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

        while True:
            logs = self._get_logs_for_execution(
                execution=execution,
                agent=agent,
                attempt_number=attempt.attempt_number,
            )

            if len(logs) == len(attempt.logs) and len(logs) > 0:
                break
            await asyncio.sleep(5)

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
            execution.end_time = datetime.datetime.now(tz=pytz.timezone("US/Pacific"))
            execution.results = results
        elif len(execution.attempts) == agent.num_retries + 1:
            execution.status = ExecutionStatus.failed
            execution.end_time = datetime.datetime.now(tz=pytz.timezone("US/Pacific"))
        else:
            execution.status = ExecutionStatus.running

        return execution
