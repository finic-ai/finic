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
)
import copy


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


def run_python_node(node: TransformNode, inputs: List[str], interim_results: Dict):
    # Run the python transformation
    pass


def run_join_node(node: TransformNode, inputs: List[str], interim_results: Dict):
    # Run the join transformation
    pass
