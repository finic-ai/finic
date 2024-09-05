from typing import Dict
from functools import wraps
import json
import os
from enum import Enum


class FinicEnvironment(str, Enum):
    LOCAL = "local"
    DEV = "dev"
    PROD = "prod"


class Finic:
    def __init__(
        self, api_key: str, environment: FinicEnvironment = FinicEnvironment.LOCAL
    ):
        finic_env = os.environ.get("FINIC_ENV")
        self.environment = FinicEnvironment(finic_env) if finic_env else environment
        self.api_key = api_key
        self.secrets_manager = FinicSecretsManager(api_key, environment=environment)

    def start_run(self, job_id: str, input_data: Dict):
        # TODO
        pass

    def get_runs(self, job_id: str):
        # TODO
        pass

    def get_run_status(self, job_id: str, run_id: str):
        # TODO
        pass

    def log_run_status(self, job_id: str, status: str, message: str):
        # TODO
        print(f"Logging status: {status} - {message}")

    def workflow_entrypoint(self, func):

        if self.environment == FinicEnvironment.LOCAL:
            # Check if input.json file is present
            path = os.path.join(os.getcwd(), "input.json")
            if not os.path.exists(path):
                raise Exception(
                    "If you are running the workflow locally, please provide input.json file in the base directory containing pyproject.toml"
                )

            try:
                with open(path, "r") as f:
                    input_data = json.load(f)
            except Exception as e:
                raise Exception("Error in reading input.json file: ", e)
        else:
            try:
                input_data = json.loads(os.environ.get("FINIC_INPUT"))
            except Exception as e:
                raise Exception("Error in parsing input data: ", e)

        @wraps(func)
        def wrapper():
            try:
                self.log_run_status("job_id", "running", "Workflow started")
                func(input_data)
                self.log_run_status("job_id", "success", "Workflow completed")
            except Exception as e:
                print("Error in workflow entrypoint: ", e)

        return wrapper


class FinicSecretsManager:
    def __init__(self, api_key, environment: FinicEnvironment):
        self.api_key = api_key
        self.environment = environment

    def save_credentials(self, credentials: Dict, credential_id: str):
        if self.environment == FinicEnvironment.LOCAL:
            raise Exception(
                "Cannot save credentials in local environment. Save them in secrets.json for local testing"
            )
        else:
            # Save secrets in Finic API
            pass

    def get_credentials(self, credential_id: str):
        if self.environment == FinicEnvironment.LOCAL:
            # Check if secrets.json file is present
            path = os.path.join(os.getcwd(), "secrets.json")
            if not os.path.exists(path):
                raise Exception(
                    "If you are running the workflow locally, please provide secrets.json file in the base directory containing pyproject.toml"
                )

            try:
                with open(path, "r") as f:
                    secrets = json.load(f)
                    return secrets.get(credential_id, {})
            except Exception as e:
                raise Exception("Error in reading secrets.json file: ", e)
        else:
            # Fetch secrets from Finic API
            pass
