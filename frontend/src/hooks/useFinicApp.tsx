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
  getSessionRecordingUrl: (sessionId: string) => Promise<string | undefined>;
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
        const response = await fetch(`${server_url}/run-agent/${agentId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify(input),
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
        const response = await fetch(`${server_url}/agent/${agentId}`, {
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
        
        const response = await fetch(`${server_url}/agent/${agentId}/list-sessions`, {
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

  const getSessionRecordingUrl = useCallback(
    async (sessionId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${server_url}/session-recording-download-link/${sessionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch session recording URL");
        }
        const data = await response.json();
        if (data.download_url) {
          return data.download_url as string;
        }
        console.log("data", data);
        return undefined;
      } catch (err: any) {
        console.log("error", err);
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
        getSessionRecordingUrl,
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
