from database import Database
from models import AppConfig, Job
from fastapi import UploadFile
import os
import zipfile
from google.cloud.devtools import cloudbuild_v1
from google.oauth2 import service_account
import json
from google.cloud import storage
from datetime import timedelta
from google.cloud import run_v2


class JobDeployer:

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
        self.jobs_client = run_v2.JobsClient(credentials=credentials)

    async def get_job_upload_link(self, job: Job, expiration_minutes: int = 15) -> str:

        bucket = self.storage_client.get_bucket(self.deployments_bucket)
        blob = bucket.blob(f"{job.id}.zip")
        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(minutes=expiration_minutes),
            method="PUT",
        )
        return url

    async def deploy_job(self, job: Job):
        # Check if the job already exists in Cloud Run
        try:
            self.jobs_client.get_job(
                name=f"projects/{self.project_id}/locations/us-central1/jobs/job-{job.id}"
            )
            job_exists = True
        except Exception:
            job_exists = False

        # Define the build steps
        build_config = self._get_build_config(job=job, job_exists=job_exists)

        # Trigger the build
        build = cloudbuild_v1.Build(
            steps=build_config["steps"],
            images=build_config["images"],
            source=cloudbuild_v1.Source(
                storage_source=cloudbuild_v1.StorageSource(
                    bucket=self.deployments_bucket,
                    object_=f"{job.id}.zip",
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

        print(f"Built and pushed Docker image: {job.id}")

    def _get_build_config(self, job: Job, job_exists: bool) -> dict:
        image_name = f"gcr.io/{self.project_id}/{job.id}:latest"
        gcs_source = f"gs://{self.deployments_bucket}/{job.id}.zip"
        job_command = "update" if job_exists else "create"
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
                        f"gcloud run jobs {job_command} job-{job.id} --image {image_name} --region us-central1 "
                        f"--tasks=1 --max-retries=3 --task-timeout=86400s --memory=4Gi",
                    ],
                },
            ],
            "images": [image_name],
        }
