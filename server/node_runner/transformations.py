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
)
import copy
import numpy as np


def run_mapping_node(
    node: MappingNode, inputs: List[str], interim_results: Dict[str, List[List[Any]]]
):
    # Run the mapping transformation

    if len(inputs) == 0:
        return
    elif len(inputs) > 1:
        raise ValueError("Mapping node can only have one input")
    input = interim_results[inputs[0]]
    input_table = interim_results[input]

    # get the mapping
    mappings = node.mappings
    # apply the mapping
    output_table = copy.deepcopy(input_table)
    # rename the columns
    # the first row is the column names
    column_names = output_table[0]

    for mapping in mappings:
        old_name = mapping.old_name
        new_name = mapping.new_name
        if old_name in column_names:
            index = column_names.index(old_name)
            column_names[index] = new_name

    interim_results[node.id] = output_table


def run_python_node(node: PythonNode, inputs: List[str], interim_results: Dict):
    # Run the python transformation
    pass


def run_join_node(node: JoinNode, inputs: List[str], interim_results: Dict):
    # Run the join transformation

    input_tables = [interim_results[input] for input in inputs]
    join_column = node.join_column
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

    interim_results[node.id] = result
