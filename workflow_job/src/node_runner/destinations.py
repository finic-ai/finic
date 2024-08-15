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
    SnowflakeDestinationConfig,
)
import copy
import numpy as np
import snowflake.connector
import pandas as pd
from snowflake.connector.pandas_tools import write_pandas


def run_snowflake_destination(
    node_config: SnowflakeDestinationConfig,
    inputs: List[str],
    interim_results: Dict[str, List[List[Any]]],
):
    connection_params = {
        "user": node_config.credentials["user"],
        "password": node_config.credentials["password"],
        "account": node_config.account,
        "warehouse": node_config.warehouse,
        "database": node_config.database,
        "schema": node_config.table_schema,
    }
    conn = snowflake.connector.connect(**connection_params)
    input_table = interim_results[inputs[0]]

    try:
        df = pd.DataFrame(input_table[1:], columns=input_table[0])
        success, nchunks, nrows, _ = write_pandas(conn, df, node_config.table)
    except Exception as e:
        print(e)
        raise e
    return input_table
