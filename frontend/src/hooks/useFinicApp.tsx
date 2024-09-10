import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import humps from "humps";
import { type Node, type Edge, type NodeTypes } from "@xyflow/react";
import { useAuth } from "@/hooks/useAuth";
import { Agent } from "@/types";

const server_url = import.meta.env.VITE_APP_SERVER_URL;

interface FinicAppContextType {
  agentId: string | null;
  setAgentId: (id: string) => void;
  isLoading: boolean;
  createAgent: (bearer: string) => Promise<Agent>;
  deleteAgent: (bearer: string, agentId: string) => Promise<Agent>;
  updateNodesAndEdges: (
    bearer: string,
    agentId: string,
    nodes: Node[],
    edges: Edge[]
  ) => Promise<Agent>;
  setAgentStatus: (
    bearer: string,
    agentId: string,
    status: string
  ) => Promise<Agent>;
  getAgent: (bearer: string, agentId: string) => Promise<Agent | undefined>;
  listAgents: (bearer: string) => Promise<Agent[]>;
  updateNodeConfig: (
    bearer: string,
    agentId: string,
    nodeId: string,
    configuration: any
  ) => Promise<Agent>;
  updateTransformationNodeCode: (
    bearer: string,
    nodeId: string,
    code: string
  ) => Promise<Agent>;
  getTransformationNodeCode: (
    bearer: string,
    nodeId: string
  ) => Promise<any>;
}

const FinicAppContext = createContext<FinicAppContextType | undefined>(undefined);

export const FinicAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agentId, setAgentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("agentId has been updated:", agentId);
  }, [agentId]);

  const createAgent = useCallback(async (bearer: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${server_url}/upsert-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
        body: JSON.stringify({
          name: "New Agent",
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

  const deleteAgent = useCallback(
    async (bearer: string, agentId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${server_url}/delete-agent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify({
            id: agentId,
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

  const getAgent = useCallback(
    async (bearer: string, agentId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${server_url}/get-agent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify({
            id: agentId,
          }),
        });
        const data = await response.json();
        return humps.camelizeKeys(data) as Agent;
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const setAgentStatus = useCallback(
    async (bearer: string, agentId: string, status: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${server_url}/upsert-agent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify({
            id: agentId,
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
      agentId: string,
      nodeId: string,
      configuration: any
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = {
          agent_id: agentId,
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
      agentId: string,
      nodes: Node[],
      edges: Edge[]
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${server_url}/upsert-agent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify({
            id: agentId,
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

  const listAgents = useCallback(async (bearer: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${server_url}/list-agents`, {
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
        agentId,
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
  }, [agentId]);

  const updateTransformationNodeCode = useCallback(async (bearer: string, nodeId: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(agentId)
      const payload = {
        agentId,
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
  }, [agentId]);

  return (
    <FinicAppContext.Provider
      value={{ 
        agentId,
        setAgentId,
        isLoading,
        createAgent,
        deleteAgent,
        updateNodesAndEdges,
        setAgentStatus,
        getAgent,
        listAgents,
        updateNodeConfig,
        updateTransformationNodeCode,
        getTransformationNodeCode
      }}
    >
      {children}
    </FinicAppContext.Provider>
  );
};

const useFinicApp = (): FinicAppContextType => {
  const context = useContext(FinicAppContext);
  if (context === undefined) {
    throw new Error('useFinicApp must be used within a FinicAppProvider');
  }
  return context;
};

export default useFinicApp;