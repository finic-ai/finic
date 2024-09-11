import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import humps from "humps";
import { type Node, type Edge, type NodeTypes } from "@xyflow/react";
import { useAuth, useUserStateContext } from "@/hooks/useAuth";
import { Agent, Execution } from "@/types";

const server_url = import.meta.env.VITE_APP_SERVER_URL;

interface FinicAppContextType {
  error: Error | null;
  isLoading: boolean;
  listAgents: () => Promise<Agent[]>;
  runAgent: (agentId: string, input: string) => Promise<Execution>;
}

const FinicAppContext = createContext<FinicAppContextType | undefined>(undefined);

export const FinicAppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { bearer } = useUserStateContext();

  const runAgent = useCallback(async (agentId: string, input: Record<string, any>) => {
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
          input: input
        }),
      });
      const data = await response.json();
      return data;
    } catch (err: any) {
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [bearer]);

  const listAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${server_url}/list-agents`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        }
      });
      const data = await response.json();
      return data;
    } catch (err: any) {
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [bearer]);

  return (
    <FinicAppContext.Provider
      value={{ 
        error,
        isLoading,
        listAgents,
        runAgent,
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