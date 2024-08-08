import { useState, useEffect, useCallback } from "react";
import { type Node, type Edge, type NodeTypes } from "@xyflow/react";
import { useAuth } from "@/hooks/useAuth";

const server_url = import.meta.env.VITE_APP_SERVER_URL;

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

export default function useWorkflow() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createWorkflow = useCallback(async (bearer: string, appId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/upsert-workflow", {
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
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getWorkflow = useCallback(async (bearer: string, appId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      //
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listWorkflows = useCallback(async (bearer: string, appId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(bearer, appId)
      const payload = {
        app_id: appId,
      }
      const response = await fetch(`${server_url}/list-workflows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
        body: JSON.stringify(payload)
      });
      console.log(response)
      const data = await response.json();
      return data;
    } catch (err: any) {
      console.log(err)
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runWorkflow = async (bearer: string, appId: string) => {
    const response = await fetch("/run-workflow", {
      //
    });
    const data = await response.json();
    console.log(data);
  };

  return {
    isLoading,
    createWorkflow,
    getWorkflow,
    listWorkflows,
    runWorkflow,
  };
}