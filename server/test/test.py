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


def upsert_workflow(workflow: Workflow):
    response = requests.post(
        "http://localhost:8080/upsert-workflow",
        json={"workflow": workflow.dict()},
        headers={"Authorization": f"Bearer {SECRET_KEY}"},
    )
    return response


def get_workflow(id: str) -> Workflow:
    response = requests.post(
        "http://localhost:8080/get-workflow",
        json={"id": id},
        headers={"Authorization": f"Bearer {SECRET_KEY}"},
    )
    if response.status_code == 200:
        return Workflow(**response.json())
    return None


def run_workflow(id: str):
    # run the workflow python script in ../../workflow_job/src/main.py
    os.system(f"python ../../workflow_job/src/main.py")


code = """
import pandas as pd
from typing import List, Optional, Dict, Any, Tuple, Type, Union
import json

print('Pandas version:', pd.__version__)
# Key: node name, Value: output data from that node
# Transform the data and output as a 2d table. The first row should be the column names.

def finic_handler(inputs: Dict[str, List[List[Any]]]) -> List[List[Any]]:
    input_table = inputs["2"]
    return input_table

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
            node_data=SourceNodeData(
                configuration=GCSSourceConfig(
                    credentials=GCS_CREDENTIALS,
                    bucket=GCS_BUCKET,
                    filename=GCS_FILENAME,
                ),
            ),
        ),
        Node(
            id="2",
            position={"x": 0, "y": 0},
            node_data=TransformNodeData(
                configuration=MappingTransformConfig(
                    mappings=[
                        ColumnMapping(old_name="Index", new_name="ID"),
                        ColumnMapping(old_name="Name", new_name="NAME"),
                        ColumnMapping(old_name="Linkedin Url", new_name="LINKEDIN_URL"),
                        ColumnMapping(
                            old_name="Est. Revenue (USD)",
                            new_name="ACCOUNT_SIZE",
                        ),
                    ],
                ),
            ),
        ),
        Node(
            id="3",
            position={"x": 0, "y": 0},
            node_data=TransformNodeData(
                configuration=PythonTransformConfig(
                    code=code,
                    dependencies=["pandas==2.2.1"],
                ),
            ),
        ),
        Node(
            id="4",
            position={"x": 0, "y": 0},
            node_data=DestinationNodeData(
                configuration=SnowflakeDestinationConfig(
                    credentials=SNOWFLAKE_CREDENTIALS,
                    account=SNOWFLAKE_ACCOUNT,
                    warehouse=SNOWFLAKE_WAREHOUSE,
                    database=SNOWFLAKE_DATABASE,
                    table_schema=SNOWFLAKE_SCHEMA,
                    table=SNOWFLAKE_TABLE,
                ),
            ),
        ),
    ],
    edges=[
        Edge(id="1", source="1", target="2"),
        Edge(id="2", source="2", target="3"),
        Edge(id="3", source="3", target="4"),
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
# run_workflow(workflow.id)
