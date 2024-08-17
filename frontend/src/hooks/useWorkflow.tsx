import { useState, useEffect, useCallback } from "react";
import humps from "humps";
import { type Node, type Edge, type NodeTypes } from "@xyflow/react";
import { useAuth } from "@/hooks/useAuth";
import { Workflow } from "@/types";

const server_url = import.meta.env.VITE_APP_SERVER_URL;

interface WorkflowOptions {
  id: string;
}

export default function useWorkflow() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createWorkflow = useCallback(async (bearer: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${server_url}/upsert-workflow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
        body: JSON.stringify({
          name: "New Workflow",
        }),
      });
      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteWorkflow = useCallback(
    async (bearer: string, workflowId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${server_url}/delete-workflow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify({
            id: workflowId,
          }),
        });
        const data = await response.json();
        return data;
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getWorkflow = useCallback(
    async (bearer: string, workflowId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${server_url}/get-workflow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify({
            id: workflowId,
          }),
        });
        const data = await response.json();
        console.log(data)
        return humps.camelizeKeys(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const setWorkflowStatus = useCallback(
    async (bearer: string, workflowId: string, status: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${server_url}/upsert-workflow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify({
            id: workflowId,
            status: status,
          }),
        });
        const data = await response.json();
        return data;
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateNodeConfig = useCallback(
    async (
      bearer: string,
      workflowId: string,
      nodeId: string,
      configuration: any
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = {
          workflow_id: workflowId,
          node_id: nodeId,
          configuration: configuration,
        };
        const response = await fetch(`${server_url}/update-node-config`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify(humps.decamelizeKeys(payload)),
        });
        const data = await response.json();
        return data;
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateNodesAndEdges = useCallback(
    async (
      bearer: string,
      workflowId: string,
      nodes: Node[],
      edges: Edge[]
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${server_url}/upsert-workflow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify({
            id: workflowId,
            nodes: humps.decamelizeKeys(nodes),
            edges: humps.decamelizeKeys(edges),
          }),
        });
        const data = await response.json();
        return data;
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const listWorkflows = useCallback(async (bearer: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${server_url}/list-workflows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      return data;
    } catch (err: any) {
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    createWorkflow,
    deleteWorkflow,
    updateNodesAndEdges,
    setWorkflowStatus,
    getWorkflow,
    listWorkflows,
    updateNodeConfig,
  };
}
