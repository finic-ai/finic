from typing import List, Optional, Tuple, Dict, Any
from models.models import SnowflakeDestinationConfig, Credential
import snowflake.connector
import pandas as pd
from snowflake.connector.pandas_tools import write_pandas


def run_snowflake_destination(
    node_config: SnowflakeDestinationConfig,
    credential: Optional[Credential],
    inputs: List[str],
    interim_results: Dict[str, List[List[Any]]],
):
    if not credential:
        raise ValueError("Missing credentials")
    credentials = credential.credentials
    connection_params = {
        "user": credentials["user"],
        "password": credentials["password"],
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
