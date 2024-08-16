import unittest
import sys

sys.path.append("../")

from models import (
    AppConfig,
    User,
    Workflow,
    Edge,
    Node,
    NodeType,
    SourceNodeData,
    GCSSourceConfig,
    ColumnMapping,
    WorkflowStatus,
    IntegrationType,
    TransformNodeData,
    TransformType,
    DestinationNodeData,
    MappingTransformConfig,
    SnowflakeDestinationConfig,
    PythonTransformConfig,
)
import requests
import os
from dotenv import load_dotenv
import json
import uuid
from deepdiff import DeepDiff

load_dotenv()


WORKFLOW_ID = os.getenv("WORKFLOW_ID")
APP_ID = os.getenv("APP_ID")
SECRET_KEY = os.getenv("SECRET_KEY")
GCS_CREDENTIALS = json.loads(os.getenv("GCS_CREDENTIALS"))
GCS_BUCKET = os.getenv("GCS_BUCKET")
GCS_FILENAME = os.getenv("GCS_FILENAME")
SNOWFLAKE_CREDENTIALS = json.loads(os.getenv("SNOWFLAKE_CREDENTIALS"))
SNOWFLAKE_ACCOUNT = os.getenv("SNOWFLAKE_ACCOUNT")
SNOWFLAKE_WAREHOUSE = os.getenv("SNOWFLAKE_WAREHOUSE")
SNOWFLAKE_DATABASE = os.getenv("SNOWFLAKE_DATABASE")
SNOWFLAKE_SCHEMA = os.getenv("SNOWFLAKE_SCHEMA")
SNOWFLAKE_TABLE = os.getenv("SNOWFLAKE_TABLE")
PROD = os.getenv("PROD") == "true"
LOCAL_SERVER_URL = os.getenv("LOCAL_SERVER_URL")
PROD_SERVER_URL = os.getenv("PROD_SERVER_URL")
SERVER_URL = PROD_SERVER_URL if PROD else LOCAL_SERVER_URL


def upsert_workflow(workflow: Workflow):
    response = requests.post(
        f"{SERVER_URL}/upsert-workflow",
        json=workflow.dict(),
        headers={"Authorization": f"Bearer {SECRET_KEY}"},
    )
    return response


def get_workflow(id: str) -> Workflow:
    response = requests.post(
        f"{SERVER_URL}/get-workflow",
        json={"id": id},
        headers={"Authorization": f"Bearer {SECRET_KEY}"},
    )
    if response.status_code == 200:
        return Workflow(**response.json())
    return None


def run_workflow(id: str):
    if PROD:
        response = requests.post(
            f"{SERVER_URL}/run-workflow",
            json={"id": id},
            headers={"Authorization": f"Bearer {SECRET_KEY}"},
        )
        return response
    else:
        print("Go to the workflow job directory and run src/main.py")


code = """
import pandas as pd
from typing import List, Optional, Dict, Any, Tuple, Type, Union
import json

# Key: node name, Value: output data from that node
# Transform the data and output as a 2d table. The first row should be the column names.

def finic_handler(inputs: Dict[str, List[List[Any]]]) -> List[List[Any]]:
    input_table = inputs["GCS Source"]
    # Rename the columns
    data_frame = pd.DataFrame(input_table[1:], columns=input_table[0])
    data_frame = data_frame.rename(
        columns={
            "Index": "ID",
            "Name": "NAME",
            "Linkedin Url": "LINKEDIN_URL",
            "Est. Revenue (USD)": "ACCOUNT_SIZE",
        }
    )
    data_frame = data_frame[["ID", "NAME", "LINKEDIN_URL", "ACCOUNT_SIZE"]]
    return [data_frame.columns.tolist()] + data_frame.values.tolist()

"""


workflow = Workflow(
    name="Test Workflow",
    status=WorkflowStatus.draft,
    id=WORKFLOW_ID,
    app_id=APP_ID,
    nodes=[
        Node(
            id="1",
            position={"x": 0, "y": 0},
            type=NodeType.SOURCE,
            data=SourceNodeData(
                name="GCS Source",
                configuration=GCSSourceConfig(
                    credentials=GCS_CREDENTIALS,
                    bucket=GCS_BUCKET,
                    filename=GCS_FILENAME,
                ),
            ).dict(),
        ),
        Node(
            id="2",
            position={"x": 0, "y": 0},
            type=NodeType.TRANSFORMATION,
            data=TransformNodeData(
                name="Python Transform",
                configuration=PythonTransformConfig(
                    code=code,
                    dependencies=["pandas==2.2.1"],
                ),
            ).dict(),
        ),
        Node(
            id="3",
            position={"x": 0, "y": 0},
            type=NodeType.DESTINATION,
            data=DestinationNodeData(
                name="Snowflake Destination",
                configuration=SnowflakeDestinationConfig(
                    credentials=SNOWFLAKE_CREDENTIALS,
                    account=SNOWFLAKE_ACCOUNT,
                    warehouse=SNOWFLAKE_WAREHOUSE,
                    database=SNOWFLAKE_DATABASE,
                    table_schema=SNOWFLAKE_SCHEMA,
                    table=SNOWFLAKE_TABLE,
                ),
            ).dict(),
        ),
    ],
    edges=[
        Edge(id="1", source="1", target="2"),
        Edge(id="2", source="2", target="3"),
    ],
)

upsert_response = upsert_workflow(workflow=workflow)
print("upsert_response", upsert_response)
response_workflow = get_workflow(workflow.id)
if response_workflow.dict() != workflow.dict():
    diff = DeepDiff(response_workflow.dict(), workflow.dict(), significant_digits=2)
    print("Difference between response_workflow and workflow:")
    print(diff)
else:
    print("Workflow upserted successfully")
run_workflow(workflow.id)
