import unittest
import sys

sys.path.append("../models")

from models import (
    AppConfig,
    User,
    Workflow,
    Edge,
    Node,
    NodeType,
    SourceNode,
    DestinationNode,
    TransformNode,
    TransformationType,
    SourceType,
    DestinationType,
    SnowflakeConfiguration,
    GCSConfiguration,
    MappingNode,
    ColumnMapping,
    WorkflowStatus,
)
import requests
import os
from dotenv import load_dotenv
import json
import uuid

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
        json=workflow.dict(),
        headers={"Authorization": f"Bearer {SECRET_KEY}"},
    )
    return response


def get_workflow(id: str) -> Workflow:
    response = requests.post(
        "http://localhost:8080/get-workflow",
        json={"id": id},
        headers={"Authorization": f"Bearer {SECRET_KEY}"},
    )
    return response


def run_workflow(id: str):
    response = requests.post(
        "http://localhost:8080/run-workflow",
        json={"id": id},
        headers={"Authorization": f"Bearer {SECRET_KEY}"},
    )
    return response


workflow = Workflow(
    name="Test Workflow",
    status=WorkflowStatus.draft,
    id=WORKFLOW_ID,
    app_id=APP_ID,
    nodes=[
        SourceNode(
            id="1",
            position={"x": 0, "y": 0},
            type=NodeType.source,
            source=SourceType.google_cloud_storage,
            credentials=GCS_CREDENTIALS,
            configuration=GCSConfiguration(
                bucket=GCS_BUCKET,
                filename=GCS_FILENAME,
            ),
        ),
        MappingNode(
            id="2",
            position={"x": 0, "y": 0},
            type=NodeType.transform,
            transformation=TransformationType.mapping,
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
        DestinationNode(
            id="3",
            position={"x": 0, "y": 0},
            type=NodeType.destination,
            destination=DestinationType.snowflake,
            credentials=SNOWFLAKE_CREDENTIALS,
            configuration=SnowflakeConfiguration(
                account=SNOWFLAKE_ACCOUNT,
                warehouse=SNOWFLAKE_WAREHOUSE,
                database=SNOWFLAKE_DATABASE,
                table_schema=SNOWFLAKE_SCHEMA,
                table=SNOWFLAKE_TABLE,
            ),
        ),
    ],
    edges=[
        Edge(id="1", source="1", target="2"),
        Edge(id="2", source="2", target="3"),
    ],
)

upsert_response = upsert_workflow(workflow=workflow)
print("upsert_response", upsert_response)
# response = get_workflow(workflow.id)
# print("response", response)
# assert response == workflow.dict()

# run_workflow(workflow.id)
