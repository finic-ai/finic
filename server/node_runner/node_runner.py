import io
from fastapi import UploadFile
from typing import List, Optional, Tuple, Dict
from models import (
    AppConfig,
    User,
    Workflow,
    Edge,
    Node,
    NodeType,
    SourceNodeData,
    DestinationNodeData,
    TransformNodeData,
    IntegrationType,
    TransformType,
)
from supabase import create_client, Client
import os
from storage3.utils import StorageException

from io import StringIO
from bs4 import BeautifulSoup
import pandas as pd
import httpx
import datetime
import tempfile
import pdb
from collections import deque
from .transformations import run_mapping_node, run_python_node, run_join_node
from .sources import run_gcs_source
from .destinations import run_snowflake_destination


class NodeRunner:
    def __init__(self):
        pass

    async def run_node(
        self, node: Node, inputs: List[str], interim_results: Dict
    ) -> bool:
        node_type = node.node_data.node_type
        if node_type == NodeType.source:
            output = await self.run_source_node(node.node_data, interim_results)
        elif node_type == NodeType.destination:
            output = await self.run_destination_node(
                node.node_data, inputs, interim_results
            )
        elif node_type == NodeType.transform:
            output = await self.run_transform_node(
                node.node_data, inputs, interim_results
            )
        else:
            raise ValueError(f"Invalid node type: {node.type}")

        interim_results[node.id] = output
        return True

    async def run_source_node(self, node_data: SourceNodeData, interim_results: Dict):
        node_config = node_data.configuration
        if node_config.source_type == IntegrationType.google_cloud_storage:
            return run_gcs_source(
                node_config=node_config,
                interim_results=interim_results,
            )
        else:
            raise ValueError(f"Invalid source type: {node_config.source_type}")

    async def run_destination_node(
        self,
        node_data: DestinationNodeData,
        inputs: List[str],
        interim_results: Dict,
    ):
        node_config = node_data.configuration
        if node_config.destination_type == IntegrationType.snowflake:
            return run_snowflake_destination(
                node_config=node_config,
                inputs=inputs,
                interim_results=interim_results,
            )
        else:
            raise ValueError(
                f"Invalid destination type: {node_config.destination_type}"
            )

    async def run_transform_node(
        self,
        node_data: TransformNodeData,
        inputs: List[str],
        interim_results: Dict,
    ):
        node_config = node_data.configuration

        if node_config.transform_type == TransformType.python:
            return run_python_node(
                node_config=node_config,
                inputs=inputs,
                interim_results=interim_results,
            )
        elif node_config.transform_type == TransformType.join_tables:
            return run_join_node(
                node_config=node_config,
                inputs=inputs,
                interim_results=interim_results,
            )
        elif node_config.transform_type == TransformType.mapping:
            return run_mapping_node(
                node_config=node_config,
                inputs=inputs,
                interim_results=interim_results,
            )
        else:
            raise ValueError(
                f"Invalid transformation type: {node_config.transform_type}"
            )
