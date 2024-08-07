import { useState, useEffect } from 'react';
import {
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';

interface Workflow {
  id: string;
  app_id: string;
  name: string;
  nodes: Array<Node>;
  edges: Array<Edge>;
}

interface WorkflowOptions {
  id: string;
}

export async function useAvailableWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const response = await fetch('/get-workflows');
  const data = await response.json();
  setWorkflows(data);
  return [workflows, setWorkflows]
}

export default function useWorkflow() {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    fetch('/get-workflow')
      .then((res) => res.json())
      .then((data) => setWorkflow(data));
  }, []);

  const getNodes = () => {
    return workflow?.nodes;
  }
  
  const getEdges = () => {
    return workflow?.edges;
  }

  const runWorkflow = async () => {
    const response = await fetch('/run-workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: workflow?.id
      }),
    });
    const data = await response.json();
    console.log(data);
  }

  const runNode = async (nodeId: string) => {
    const response = await fetch('/api/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        node_id: nodeId,
        options: {},
      }),
    });
    const data = await response.json();
    console.log(data);
  }

  return {
    getNodes,
    getEdges,
    runWorkflow
  };
}