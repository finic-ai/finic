from typing import Dict, Optional, List
from functools import wraps
import json
import os
from enum import Enum
import requests
import datetime
import sys
from pydantic import BaseModel
from typing import Any


class FinicEnvironment(str, Enum):
    LOCAL = "local"
    DEV = "dev"
    PROD = "prod"


class LogSeverity(str, Enum):
    DEFAULT = "DEFAULT"
    WARNING = "WARNING"
    ERROR = "ERROR"


class ExecutionLog(BaseModel):
    severity: LogSeverity
    message: str
    timestamp: Optional[datetime.datetime] = None

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat() if v else None}


class ExecutionAttempt(BaseModel):
    success: bool
    attempt_number: int
    logs: List[ExecutionLog] = []


class LogExecutionAttemptRequest(BaseModel):
    execution_id: str
    agent_id: str
    results: Dict[str, Any]
    attempt: ExecutionAttempt


class StdoutLogger:
    def __init__(self, original_stdout):
        self.logs: List[ExecutionLog] = []
        self.original_stdout = original_stdout

    def write(self, message):
        if message.strip():  # Avoid logging empty messages
            log = ExecutionLog(
                severity=LogSeverity.DEFAULT,
                timestamp=datetime.datetime.now(datetime.timezone.utc),
                message=message.strip(),
            )
            self.logs.append(log)
            self.original_stdout.write(
                f"{log.timestamp} [{log.severity.value}] {log.message}\n"
            )

    def flush(self):
        pass

    def get_logs(self):
        return self.logs


class Finic:
    def __init__(
        self,
        api_key: Optional[str] = None,
        environment: Optional[FinicEnvironment] = None,
        url: Optional[str] = None,
    ):

        default_env = os.environ.get("FINIC_ENV") or FinicEnvironment.LOCAL
        self.environment = environment if environment else FinicEnvironment(default_env)
        self.secrets_manager = FinicSecretsManager(api_key, environment=environment)
        if url:
            self.url = url
        else:
            self.url = "https://finic-521298051240.us-central1.run.app"
        if api_key:
            self.api_key = api_key
        else:
            self.api_key = os.getenv("FINIC_API_KEY")

    def deploy_agent(
        self, agent_id: str, agent_name: str, num_retries: int, project_zipfile: str
    ):
        with open(project_zipfile, "rb") as f:
            upload_file = f.read()

        response = requests.post(
            f"{self.url}/get-agent-upload-link",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json={
                "agent_id": agent_id,
                "agent_description": agent_name,
                "num_retries": num_retries,
            },
        )

        response_json = response.json()

        upload_link = response_json["upload_link"]

        # Upload the project zip file to the upload link
        requests.put(upload_link, data=upload_file)

        print("Project files uploaded for build.")

        response = requests.post(
            f"{self.url}/deploy-agent",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json={
                "agent_id": agent_id,
                "agent_description": agent_name,
                "num_retries": num_retries,
            },
        )

        response_json = response.json()

        if "id" in response_json:
            return "Deploying agent. Check Finic dashboard for status: https://app.finic.io/"
        else:
            return "Error in deploying agent"

    def start_run(self, agent_id: str, input: Dict):
        response = requests.post(
            f"{self.url}/run-agent",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json={"agent_id": agent_id, "input": input},
        )

        response_json = response.json()
        return response_json

    def get_runs(self, agent_id: str):
        # TODO
        pass

    def get_run_status(self, agent_id: str, run_id: str):
        # TODO
        pass

    def log_attempt(
        self, success: bool, logs: List[ExecutionLog], results: Optional[Dict] = None
    ):
        if self.environment == FinicEnvironment.LOCAL:
            if success:
                print("Successful execution. Results: ", results)
            else:
                print("Failed execution.")
        else:
            execution_id = os.getenv("FINIC_EXECUTION_ID")
            agent_id = os.getenv("FINIC_AGENT_ID")
            attempt_number = os.getenv("CLOUD_RUN_TASK_ATTEMPT")

            payload = LogExecutionAttemptRequest(
                execution_id=execution_id,
                agent_id=agent_id,
                results=results,
                attempt=ExecutionAttempt(
                    success=success,
                    logs=logs,
                    attempt_number=attempt_number,
                ),
            )
            requests.post(
                f"{self.url}/log-execution-attempt",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json=json.loads(payload.json()),
                timeout=5,
            )

    def workflow_entrypoint(self, input_model: BaseModel):

        if self.environment == FinicEnvironment.LOCAL:
            # Check if input.json file is present
            path = os.path.join(os.getcwd(), "input.json")
            if not os.path.exists(path):
                raise Exception(
                    "If you are running the agent locally, please provide input.json file in the base directory containing pyproject.toml"
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

        try:
            input_data = input_model(**input_data)
        except Exception as e:
            raise Exception("Error in validating input data: ", e)

        def decorator(func):
            @wraps(func)
            def wrapper():
                stdout_logger = StdoutLogger(original_stdout=sys.stdout)
                try:
                    sys.stdout = stdout_logger
                    results = func(input_data)
                    logs = stdout_logger.get_logs()
                    self.log_attempt(success=True, logs=logs, results=results)
                except Exception as e:
                    logs = stdout_logger.get_logs()
                    logs.append(
                        ExecutionLog(
                            severity=LogSeverity.ERROR,
                            timestamp=datetime.datetime.now(datetime.timezone.utc),
                            message=str(e),
                        )
                    )
                    self.log_attempt(
                        success=False,
                        logs=logs,
                        results={},
                    )
                    raise e

            return wrapper

        return decorator


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
