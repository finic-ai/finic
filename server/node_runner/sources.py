import io
from fastapi import UploadFile
from typing import List, Optional, Tuple, Dict, Any
from models.models import (
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
    MappingNode,
    PythonNode,
    JoinNode,
    GCSNode,
)
import copy
import numpy as np
from google.auth.transport.requests import Request
from google.auth import jwt
from urllib.parse import quote
import requests
import pandas as pd


def run_gcs_source(node: GCSNode, interim_results: Dict[str, List[List[Any]]]):
    service_account_info = node.credentials
    bucket = node.bucket
    # url encode the filename
    filename = quote(node.filename, safe="")

    # make sure the file is a csv or excel file
    if (
        not filename.endswith(".csv")
        and not filename.endswith(".xls")
        and not filename.endswith(".xlsx")
    ):
        raise ValueError("Invalid file type. Only csv and excel files are supported")

    # get the data from GCS
    credentials = jwt.Credentials.from_service_account_info(
        service_account_info, audience="https://storage.googleapis.com/"
    )
    credentials.refresh(Request())
    access_token = credentials.token
    url = f"https://storage.googleapis.com/storage/v1/b/{bucket}/o/{filename}?alt=media"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise ValueError(f"Failed to get file from GCS: {response.text}")

    # get the data from the response
    if filename.endswith(".csv"):
        data = response.text
    else:
        data = io.BytesIO(response.content)

    # parse the data
    if filename.endswith(".csv"):
        df = pd.read_csv(io.StringIO(data))
    else:
        df = pd.read_excel(data)

    interim_results[node.id] = df.values.tolist()
