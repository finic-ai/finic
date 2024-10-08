import subprocess
import requests
import os
from typing import Dict, Any
import sys
from fastapi import BackgroundTasks
from google.cloud import run_v2
import json
import datetime
from google.oauth2 import service_account






class WorkerClient:
    def __init__(self, api_key: str, background_tasks: BackgroundTasks):
        self.url = os.getenv("WORKER_URL")
        self.environment = os.getenv("ENVIRONMENT")
        self.api_key = api_key
        self.background_tasks = background_tasks
        self.project = os.getenv("GCLOUD_PROJECT")
        self.location = os.getenv("GCLOUD_LOCATION")
        service_account_info = json.loads(os.getenv("GCLOUD_SERVICE_ACCOUNT"))
        self.credentials = service_account.Credentials.from_service_account_info(
            service_account_info
        )


    def run_worker(
            self, 
            session_id: str, 
            browser_id: str, 
            agent_id: str, 
            agent_input: Dict[str, Any] = None
        ):
        if self.environment == "production":
             self.run_worker_remotely(session_id, browser_id, agent_id, agent_input)
        else:   
            self.run_worker_locally(session_id, browser_id, agent_id, agent_input)  
        return
    
    def run_worker_locally(
            self,
            session_id: str,
            browser_id: str,
            agent_id: str,
            agent_input: Dict[str, Any] = None
        ):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        worker_dir = os.path.abspath(os.path.join(current_dir, "..", ".."))
        sys.path.append(worker_dir)
        from worker.run_worker import run_worker
        self.background_tasks.add_task(run_worker, agent_id, self.api_key, {})

    def run_worker_remotely(
            self,
            session_id: str,
            browser_id: str,
            agent_id: str,
            agent_input: Dict[str, Any] = None
        ):
        client = run_v2.JobsClient(credentials=self.credentials)
        request = run_v2.RunJobRequest(
            name=f"projects/{self.project}/locations/{self.location}/jobs/agent-worker",
            overrides={
                "container_overrides": [
                    {
                        "env": [
                            {"name": "FINIC_INPUT", "value": json.dumps(agent_input)},
                            {"name": "FINIC_API_KEY", "value": self.api_key},
                            {"name": "FINIC_AGENT_ID", "value": agent_id},
                            {"name": "FINIC_SESSION_ID", "value": session_id},
                        ]
                    }
                ]
            },
        )
        operation = client.run_job(request)

        execution_path = operation.metadata.name
        cloud_provider_id = execution_path.split("/")[-1]
        print(f"Started session: {session_id}")
        return cloud_provider_id

