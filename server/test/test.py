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
)
import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()


WORKFLOW_ID = "123"
APP_ID = os.getenv("APP_ID")
SECRET_KEY = os.getenv("SECRET_KEY")
GCS_CREDENTIALS = json.loads(os.getenv("GCS_CREDENTIALS"))
SNOWFLAKE_CREDENTIALS = os.getenv("SNOWFLAKE_CREDENTIALS")


def upsert_workflow(workflow: Workflow):
    response = requests.post(
        "http://localhost:8000/upsert_workflow",
        json=workflow.dict(),
        headers={"Authorization ": f"Bearer {SECRET_KEY}"},
    )
    return response


def get_workflow() -> Workflow:
    response = requests.post(
        "http://localhost:8000/get_workflow",
        json={"id": "123"},
        headers={"Authorization ": f"Bearer {SECRET_KEY}"},
    )
    return response


def run_workflow(id: str):
    response = requests.post(
        "http://localhost:8000/run_workflow",
        json={"id": id},
        headers={"Authorization ": f"Bearer {SECRET_KEY}"},
    )
    return response


workflow = Workflow(
    id=WORKFLOW_ID,
    app_id=APP_ID,
    nodes=[
        SourceNode(
            id="1",
            position={"x": 0, "y": 0},
            type=NodeType.source,
            source=SourceType.google_cloud_storage,
            credentials={"token": "123"},
            configuration=GCSConfiguration(
                bucket="bucket",
                filename="filename",
                project_id="project_id",
            ),
        ),
        TransformNode(
            id="2",
            position={"x": 0, "y": 0},
            type=NodeType.transform,
            transformation=TransformationType.mapping,
        ),
        DestinationNode(
            id="3",
            position={"x": 0, "y": 0},
            type=NodeType.destination,
            destination=DestinationType.snowflake,
            credentials={"token": "123"},
            configuration=SnowflakeConfiguration(
                account="account",
                warehouse="warehouse",
                database="database",
                table_schema="schema",
                table="table",
            ),
        ),
    ],
    edges=[
        Edge(id="1", source="1", destination="2"),
        Edge(id="2", source="2", destination="3"),
    ],
)

upsert_workflow(workflow=workflow)
response = get_workflow(workflow.id)
assert response == workflow.dict()

run_workflow(workflow.id)
