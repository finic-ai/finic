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
)
import copy


def run_mapping_node(node: TransformNode, inputs: List[str], interim_results: Dict[str, List[List[Any]]]):
    # Run the mapping transformation

    if len(inputs) == 0:
        return
    elif len(inputs) > 1:
        raise ValueError("Mapping node can only have one input")
    input = interim_results[inputs[0]]
    input_table = interim_results[input]

    # get the mapping

    mappings = node.configuration

    # apply the mapping
    output_table = copy.deepcopy(input_table)

    # rename the columns 

    for mapping in mappings:
        

    






def run_python_node(node: TransformNode, inputs: List[str], interim_results: Dict):
    # Run the python transformation
    pass


def run_join_node(node: TransformNode, inputs: List[str], interim_results: Dict):
    # Run the join transformation
    pass
