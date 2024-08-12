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
    MappingTransformConfig,
    PythonTransformConfig,
    JoinTransformConfig,
)
import copy
import numpy as np
import pandas as pd


def run_mapping_node(
    node_config: MappingTransformConfig,
    inputs: List[str],
    interim_results: Dict[str, List[List[Any]]],
):
    # Run the mapping transformation

    if len(inputs) == 0:
        return
    elif len(inputs) > 1:
        raise ValueError("Mapping node can only have one input")
    input_table = interim_results[inputs[0]]

    # get the mapping
    mappings = node_config.mappings
    # apply the mapping
    output_table = pd.DataFrame(input_table[1:], columns=input_table[0])
    # rename the columns according to the mapping and drop the columns that are not in the mapping
    output_table = output_table.rename(
        columns={mapping.old_name: mapping.new_name for mapping in mappings}
    )
    output_table = output_table[[mapping.new_name for mapping in mappings]]

    return [output_table.columns.tolist()] + output_table.values.tolist()


def run_python_node(
    node_config: PythonTransformConfig,
    inputs: List[str],
    interim_results: Dict,
):
    # Run the python transformation
    pass


def run_join_node(
    node_config: JoinTransformConfig,
    inputs: List[str],
    interim_results: Dict,
):
    # Run the join transformation

    input_tables = [interim_results[input] for input in inputs]
    join_column = node_config.join_column
    # make sure each input table has the join column
    for input_table in input_tables:
        if join_column not in input_table[0]:
            raise ValueError(f"Join column {join_column} not found in input table")

    # Extract the column data from each table
    columns_data = [
        np.array([row[join_column] for row in table]) for table in input_tables
    ]

    # Start with the first table's data
    result = input_tables[0]
    for i in range(1, len(input_tables)):
        # Find the indices in both tables where the join column matches
        left_indices = np.where(np.isin(columns_data[0], columns_data[i]))[0]
        right_indices = np.where(np.isin(columns_data[i], columns_data[0]))[0]

        # Create the joined rows
        new_result = []
        for left_index, right_index in zip(left_indices, right_indices):
            # Merge the rows by combining their dictionaries
            new_row = {**result[left_index], **input_tables[i][right_index]}
            new_result.append(new_row)

        # Update the result and columns_data
        result = new_result
        columns_data[0] = np.array([row[join_column] for row in result])

    return result
