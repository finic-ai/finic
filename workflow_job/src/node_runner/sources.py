import io
from typing import List, Optional, Tuple, Dict, Any
from models.models import (
    GCSSourceConfig,
)
import copy
import numpy as np
from google.auth.transport.requests import Request
from google.auth import jwt
from urllib.parse import quote
import pandas as pd
from google.cloud import storage
from google.oauth2 import service_account
from models.models import Credential


def run_gcs_source(
    node_config: GCSSourceConfig,
    credential: Optional[Credential],
    interim_results: Dict[str, List[List[Any]]],
):
    if not credential:
        raise ValueError("Missing credentials")

    service_account_info = credential.credentials
    bucket = node_config.bucket
    # url encode the filename
    filename = quote(node_config.filename, safe="")

    # make sure the file is a csv or excel file
    if (
        not filename.endswith(".csv")
        and not filename.endswith(".xls")
        and not filename.endswith(".xlsx")
    ):
        raise ValueError("Invalid file type. Only csv and excel files are supported")

    # get the data from GCS
    credentials = service_account.Credentials.from_service_account_info(
        service_account_info,
    )
    storage_client = storage.Client(credentials=credentials)
    bucket = storage_client.get_bucket(bucket)
    blob = bucket.blob(filename)
    data = blob.download_as_string()
    if filename.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(data))
        print(df)
    else:
        df = pd.read_excel(io.BytesIO(data))

    result = []
    result.append(df.columns.tolist())
    result.extend(df.values.tolist())

    # replace all NaN values with None
    result = [[None if pd.isna(value) else value for value in row] for row in result]
    return result
