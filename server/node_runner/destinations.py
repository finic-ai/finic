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


def run_snowflake_destination(
    node: MappingNode, inputs: List[str], interim_results: Dict[str, List[List[Any]]]
):
    pass
