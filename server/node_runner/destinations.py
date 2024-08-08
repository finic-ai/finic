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
    SnowflakeConfiguration,
)
import copy
import numpy as np
import snowflake.connector
import pandas as pd


def run_snowflake_destination(
    node: DestinationNode,
    node_config: SnowflakeConfiguration,
    inputs: List[str],
    interim_results: Dict[str, List[List[Any]]],
):
    connection_params = {
        "user": node.credentials["user"],
        "password": node.credentials["password"],
        "account": node_config.account,
        "warehouse": node_config.warehouse,
        "database": node_config.database,
        "schema": node_config.table_schema,
    }
    conn = snowflake.connector.connect(**connection_params)
    input_table = interim_results[inputs[0]]

    try:
        # Create a cursor object
        cursor = conn.cursor()

        # Convert DataFrame to a list of tuples (Snowflake doesn't support pandas DataFrames directly)
        columns = input_table[0]
        # Define the table name
        table_name = node_config.table

        # Create a SQL statement for inserting data
        insert_sql = f"""
        INSERT INTO {table_name} ({', '.join(columns)})
        VALUES ({', '.join(['%s' for _ in columns])})
        """

        # Execute the SQL statement with the data
        cursor.executemany(insert_sql, input_table[1:])
        conn.commit()
    finally:
        # Close the connection
        cursor.close()
        conn.close()

    return True
