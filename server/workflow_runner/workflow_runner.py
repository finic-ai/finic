import io
from fastapi import UploadFile
from typing import List, Optional, Tuple, Dict
from models.models import (
    AppConfig,
    User,
    Workflow,
    Edge,
    WorkflowRunStatus,
    WorkflowRun,
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
from node_runner import NodeRunner
from database import Database


class WorkflowRunner:
    def __init__(self):
        pass

    async def save_workflow_run(
        self, db: Database, workflow_id: str, status: WorkflowRunStatus, results: Dict
    ):
        workflow_run = WorkflowRun(
            workflow_id=workflow_id,
            results=results,
            status=status,
        )

        await db.save_workflow_run(workflow_run)

    async def run_workflow(self, workflow: Workflow, db) -> Dict:
        nodes = workflow.nodes
        edges = workflow.edges

        node_id_to_node = {node.id: node for node in nodes}

        graph = {node.id: [] for node in nodes}
        in_degree = {node.id: 0 for node in nodes}
        results = {node.id: None for node in nodes}

        # Build the graph and in-degree dictionary
        for edge in edges:
            graph[edge.source].append(edge.target)
            in_degree[edge.target] += 1

        # Find all nodes with no incoming edges
        queue = deque([node_id for node_id in in_degree if in_degree[node_id] == 0])
        topological_order = []

        node_runner = NodeRunner()

        while queue:
            current_node = queue.popleft()
            topological_order.append(current_node)

            # Execute the current node
            # Collect input nodes (dependencies) for this node
            input_nodes = [edge.source for edge in edges if edge.target == current_node]

            await node_runner.run_node(
                node_id_to_node[current_node], input_nodes, results
            )

            print(f"Executing node {current_node} with inputs {input_nodes}")

            # Reduce in-degree of neighboring nodes
            for neighbor in graph[current_node]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        if len(topological_order) == len(nodes):
            # All nodes executed successfully in topological order.
            await self.save_workflow_run(
                db, workflow.id, WorkflowRunStatus.successful, results
            )
            return results
        else:
            # There exists a cycle in the graph.
            await self.save_workflow_run(
                db, workflow.id, WorkflowRunStatus.failed, results
            )
            raise ValueError("Workflow contains a cycle")
