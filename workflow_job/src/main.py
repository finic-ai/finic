import json
import os
import random
import sys
import time
from workflow_runner import WorkflowRunner
from workflow_database import Database
from models import WorkflowRunStatus
from dotenv import load_dotenv

load_dotenv()
# Retrieve Job-defined env vars
TASK_INDEX = os.getenv("CLOUD_RUN_TASK_INDEX", 0)
TASK_ATTEMPT = os.getenv("CLOUD_RUN_TASK_ATTEMPT", 0)
# Retrieve User-defined env vars
WORKFLOW_ID = os.getenv("WORKFLOW_ID")
SECRET_KEY = os.getenv("SECRET_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
VARIABLE = os.getenv("VARIABLE")
print(WORKFLOW_ID)
print(SUPABASE_URL)
print(VARIABLE)

env_vars = os.environ

# Print all environment variables
for key, value in env_vars.items():
    print(f"{key}: {value}")


# Define main script
def main(workflow_id):
    db = Database()
    config = db.get_config(SECRET_KEY)
    workflow_runner = WorkflowRunner(db=db, config=config)
    try:
        workflow = db.get_workflow(workflow_id, config.app_id)
        workflow_runner.run_workflow(workflow)
    except Exception as err:
        message = (
            f"Workflow {WORKFLOW_ID}, " + f"Attempt #{TASK_ATTEMPT} failed: {str(err)}"
        )

        print(json.dumps({"message": message, "severity": "ERROR"}))
        workflow_runner.save_workflow_run(
            workflow_id=workflow_id,
            status=WorkflowRunStatus.failed,
            results={},
        )

    print(f"Completed Task #{TASK_INDEX}.")


# Start script
if __name__ == "__main__":
    try:
        main(WORKFLOW_ID)
    except Exception as err:
        message = (
            f"Workflow {WORKFLOW_ID}, " + f"Attempt #{TASK_ATTEMPT} failed: {str(err)}"
        )

        print(json.dumps({"message": message, "severity": "ERROR"}))
        sys.exit(1)  # Retry Job Task by exiting the process
