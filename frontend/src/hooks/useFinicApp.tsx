import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import humps from "humps";
import { type Node, type Edge, type NodeTypes } from "@xyflow/react";
import { useAuth, useUserStateContext } from "@/hooks/useAuth";
import { Agent, Execution } from "@/types";

const server_url = import.meta.env.VITE_APP_SERVER_URL;

interface FinicAppContextType {
  error: Error | null;
  isLoading: boolean;
  listAgents: () => Promise<Agent[] | undefined>;
  getAgent: (agentId: string) => Promise<Agent | undefined>;
  runAgent: (
    agentId: string,
    input: Record<string, any>
  ) => Promise<Execution | undefined>;
  listExecutions: (agentId?: string) => Promise<Execution[] | undefined>;
}

const FinicAppContext = createContext<FinicAppContextType | undefined>(
  undefined
);

export const FinicAppContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { bearer } = useUserStateContext();

  const runAgent = useCallback(
    async (agentId: string, input: Record<string, any>) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${server_url}/run-agent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify({
            agent_id: agentId,
            input: input,
          }),
        });
        const data = await response.json();
        return humps.camelizeKeys(data) as Execution;
      } catch (err: any) {
        console.log(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [bearer]
  );

  const listAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${server_url}/list-agents`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
      });
      const data = await response.json();
      return humps.camelizeKeys(data) as Agent[];
    } catch (err: any) {
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [bearer]);

  const getAgent = useCallback(
    async (agentId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        var url = `${server_url}/get-agent`;
        if (agentId) {
          const params = new URLSearchParams({ agent_id: agentId });
          url = `${server_url}/get-agent?${params.toString()}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
        });
        const data = await response.json();
        return humps.camelizeKeys(data) as Agent;
      } catch (err: any) {
        console.log(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [bearer]
  );

  const listExecutions = useCallback(
    async (agentId?: string) => {
      try {
        setIsLoading(true);
        setError(null);
        var url = `${server_url}/list-executions`;
        if (agentId) {
          const params = new URLSearchParams({ agent_id: agentId });
          url = `${server_url}/list-executions?${params.toString()}`;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
        });
        const data = await response.json();
        console.log(data);
        return humps.camelizeKeys(data) as Execution[];
      } catch (err: any) {
        console.log(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [bearer]
  );

  return (
    <FinicAppContext.Provider
      value={{
        error,
        isLoading,
        listAgents,
        runAgent,
        listExecutions,
        getAgent,
      }}
    >
      {children}
    </FinicAppContext.Provider>
  );
};

const useFinicApp = (): FinicAppContextType => {
  const context = useContext(FinicAppContext);
  if (context === undefined) {
    throw new Error("useFinicApp must be used within a FinicAppProvider");
  }
  return context;
};

export default useFinicApp;
