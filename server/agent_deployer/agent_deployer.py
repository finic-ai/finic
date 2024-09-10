from database import Database
from models import AppConfig, Agent
from fastapi import UploadFile
import os
import zipfile
from google.cloud.devtools import cloudbuild_v1
from google.oauth2 import service_account
import json
from google.cloud import storage
from datetime import timedelta
from google.cloud import run_v2


class AgentDeployer:

    def __init__(self, db: Database, config: AppConfig):
        self.db = db
        self.config = config

        service_account_string = os.getenv("GCLOUD_SERVICE_ACCOUNT")
        self.deployments_bucket = os.getenv("DEPLOYMENTS_BUCKET")
        self.project_id = os.getenv("GCLOUD_PROJECT")
        credentials = service_account.Credentials.from_service_account_info(
            json.loads(service_account_string)
        )

        self.storage_client = storage.Client(credentials=credentials)
        self.build_client = cloudbuild_v1.CloudBuildClient(credentials=credentials)
        self.agents_client = run_v2.AgentsClient(credentials=credentials)

    async def get_agent_upload_link(self, agent: Agent, expiration_minutes: int = 15) -> str:

        bucket = self.storage_client.get_bucket(self.deployments_bucket)
        blob = bucket.blob(f"{agent.id}.zip")
        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(minutes=expiration_minutes),
            method="PUT",
        )
        return url

    async def deploy_agent(self, agent: Agent):
        # Check if the agent already exists in Cloud Run
        try:
            self.agents_client.get_agent(
                name=f"projects/{self.project_id}/locations/us-central1/agents/agent-{agent.id}"
            )
            agent_exists = True
        except Exception:
            agent_exists = False

        # Define the build steps
        build_config = self._get_build_config(agent=agent, agent_exists=agent_exists)

        # Trigger the build
        build = cloudbuild_v1.Build(
            steps=build_config["steps"],
            images=build_config["images"],
            source=cloudbuild_v1.Source(
                storage_source=cloudbuild_v1.StorageSource(
                    bucket=self.deployments_bucket,
                    object_=f"{agent.id}.zip",
                )
            ),
        )
        operation = self.build_client.create_build(
            project_id=self.project_id, build=build
        )

        # Wait for the build to complete
        result = operation.result()
        if result.status != cloudbuild_v1.Build.Status.SUCCESS:
            raise Exception(f"Build failed with status: {result.status}")

        print(f"Built and pushed Docker image: {agent.id}")

    def _get_build_config(self, agent: Agent, agent_exists: bool) -> dict:
        image_name = f"gcr.io/{self.project_id}/{agent.id}:latest"
        gcs_source = f"gs://{self.deployments_bucket}/{agent.id}.zip"
        agent_command = "update" if agent_exists else "create"
        return {
            "steps": [
                {
                    "name": "gcr.io/cloud-builders/gsutil",
                    "args": ["cp", gcs_source, "/workspace/source.zip"],
                },
                {
                    "name": "gcr.io/cloud-builders/gcloud",
                    "entrypoint": "bash",
                    "args": [
                        "-c",
                        "apt-get update && apt-get install -y unzip && unzip /workspace/source.zip -d /workspace/unzipped",
                    ],
                },
                {
                    "name": "gcr.io/cloud-builders/docker",
                    "args": ["build", "-t", image_name, "/workspace/unzipped"],
                },
                {
                    "name": "gcr.io/cloud-builders/docker",
                    "args": ["push", image_name],
                },
                {
                    "name": "gcr.io/google.com/cloudsdktool/cloud-sdk",
                    "entrypoint": "bash",
                    "args": [
                        "-c",
                        f"gcloud run agents {agent_command} {Agent.get_cloud_agent_id(agent)} --image {image_name} --region us-central1 "
                        f"--tasks=1 --max-retries=3 --task-timeout=86400s --memory=4Gi",
                    ],
                },
            ],
            "images": [image_name],
        }
