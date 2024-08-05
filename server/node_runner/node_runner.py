import io
from fastapi import UploadFile
from typing import List, Optional, Tuple, Dict
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


class NodeRunner:
    def __init__(self):
        pass

    async def run_node(
        self, node: Node, inputs: List[str], interim_results: Dict
    ) -> bool:
        if node.type == NodeType.source:
            output = await self.run_source_node(node)
        elif node.type == NodeType.destination:
            output = await self.run_destination_node(node, inputs, interim_results)
        elif node.type == NodeType.transform:
            output = await self.run_transform_node(node, inputs, interim_results)
        else:
            raise ValueError(f"Invalid node type: {node.type}")

        interim_results[node.id] = output
        return True

    async def run_source_node(self, node: SourceNode) -> bool:
        if node.source == "google_cloud_storage":
            return await self.run_gcs_source(node)
        else:
            raise ValueError(f"Invalid source type: {node.source}")

    async def run_destination_node(
        self, node: DestinationNode, inputs: List[str], interim_results: Dict
    ) -> bool:
        if node.destination == "snowflake":
            return await self.run_snowflake_destination(node, inputs)
        else:
            raise ValueError(f"Invalid destination type: {node.destination}")

    async def run_transform_node(
        self, node: TransformNode, inputs: List[str], interim_results: Dict
    ) -> bool:
        if node.transformation == TransformationType.python:
            pass
        elif node.transformation == TransformationType.sql:
            pass
        elif node.transformation == TransformationType.join:
            pass
        elif node.transformation == TransformationType.mapping:
            pass
        elif node.transformation == TransformationType.split:
            pass
        elif node.transformation == TransformationType.filter:
            pass
        elif node.transformation == TransformationType.conditional:
            pass
        else:
            raise ValueError(f"Invalid transformation type: {node.transformation}")
