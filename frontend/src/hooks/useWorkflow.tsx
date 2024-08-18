import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import humps from "humps";
import { type Node, type Edge, type NodeTypes } from "@xyflow/react";
import { useAuth } from "@/hooks/useAuth";
import { Workflow } from "@/types";

const server_url = import.meta.env.VITE_APP_SERVER_URL;

interface WorkflowContextType {
  workflowId: string | null;
  setWorkflowId: (id: string) => void;
  isLoading: boolean;
  createWorkflow: (bearer: string) => Promise<Workflow>;
  deleteWorkflow: (bearer: string, workflowId: string) => Promise<Workflow>;
  updateNodesAndEdges: (
    bearer: string,
    workflowId: string,
    nodes: Node[],
    edges: Edge[]
  ) => Promise<Workflow>;
  setWorkflowStatus: (
    bearer: string,
    workflowId: string,
    status: string
  ) => Promise<Workflow>;
  getWorkflow: (bearer: string, workflowId: string) => Promise<Workflow | undefined>;
  listWorkflows: (bearer: string) => Promise<Workflow[]>;
  updateNodeConfig: (
    bearer: string,
    workflowId: string,
    nodeId: string,
    configuration: any
  ) => Promise<Workflow>;
  updateTransformationNodeCode: (
    bearer: string,
    nodeId: string,
    code: string
  ) => Promise<Workflow>;
  getTransformationNodeCode: (
    bearer: string,
    nodeId: string
  ) => Promise<any>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("workflowId has been updated:", workflowId);
  }, [workflowId]);

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
        return humps.camelizeKeys(data) as Workflow;
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

  const getTransformationNodeCode = useCallback(async (bearer: string, nodeId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        workflowId,
        nodeId,
      };
      console.log(payload)
      const response = await fetch(`${server_url}/get-transformation`, {
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
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [workflowId]);

  const updateTransformationNodeCode = useCallback(async (bearer: string, nodeId: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(workflowId)
      const payload = {
        workflowId,
        nodeId,
        code
      };
      const response = await fetch(`${server_url}/upsert-transformation`, {
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
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [workflowId]);

  return (
    <WorkflowContext.Provider
      value={{ 
        workflowId,
        setWorkflowId,
        isLoading,
        createWorkflow,
        deleteWorkflow,
        updateNodesAndEdges,
        setWorkflowStatus,
        getWorkflow,
        listWorkflows,
        updateNodeConfig,
        updateTransformationNodeCode,
        getTransformationNodeCode
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

export default useWorkflow;