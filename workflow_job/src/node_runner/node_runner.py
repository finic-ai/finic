from typing import List, Dict
from models.models import (
    Node,
    NodeType,
    SourceNodeData,
    DestinationNodeData,
    TransformNodeData,
)
from models.node_configurations import (
    IntegrationType,
    TransformType,
)
from collections import deque
from .transformations import run_mapping_node, run_python_node
from .sources import run_gcs_source
from .destinations import run_snowflake_destination


class NodeRunner:
    def __init__(self, app_id: str):
        self.app_id = app_id

    def run_node(self, node: Node, inputs: List[Node], interim_results: Dict) -> bool:
        node_type = node.type
        if node_type == NodeType.SOURCE:
            output = self.run_source_node(node.data, interim_results)
        elif node_type == NodeType.DESTINATION:
            output = self.run_destination_node(node.data, inputs, interim_results)
        elif node_type == NodeType.TRANSFORMATION:
            output = self.run_transform_node(node.data, inputs, interim_results)
        else:
            raise ValueError(f"Invalid node type: {node.type}")

        interim_results[node.id] = output
        return True

    def run_source_node(self, node_data: SourceNodeData, interim_results: Dict):
        node_config = node_data.configuration
        if node_config.source_type == IntegrationType.google_cloud_storage:
            return run_gcs_source(
                node_config=node_config,
                interim_results=interim_results,
            )
        else:
            raise ValueError(f"Invalid source type: {node_config.source_type}")

    def run_destination_node(
        self,
        data: DestinationNodeData,
        inputs: List[Node],
        interim_results: Dict,
    ):
        node_config = data.configuration
        if node_config.destination_type == IntegrationType.snowflake:
            return run_snowflake_destination(
                node_config=node_config,
                inputs=[input.id for input in inputs],
                interim_results=interim_results,
            )
        else:
            raise ValueError(
                f"Invalid destination type: {node_config.destination_type}"
            )

    def run_transform_node(
        self,
        data: TransformNodeData,
        inputs: List[Node],
        interim_results: Dict,
    ):
        node_config = data.configuration

        if node_config.transform_type == TransformType.python:
            return run_python_node(
                node_config=node_config,
                inputs=inputs,
                interim_results=interim_results,
            )
        else:
            raise ValueError(
                f"Invalid transformation type: {node_config.transform_type}"
            )
