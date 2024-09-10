import { useState, useEffect, useCallback } from "react";
import humps from "humps";
import { type Node, type Edge, type NodeTypes } from "@xyflow/react";
import { useAuth } from "@/hooks/useAuth";
import { Agent } from "@/types";
import useUtils from "@/hooks/useUtils";
const server_url = import.meta.env.VITE_APP_SERVER_URL;

export function useAgentRun(bearer: string, agentId: string) {
  const [agentRunLoading, setAgentRunLoading] = useState<boolean>(false);
  const [agentRunError, setAgentRunError] = useState<Error | null>(null);
  const [agentRun, setAgentRun] = useState<any>(null);
  const [pollInterval, setPollInterval] = useState<number | null>(null);
  const { useInterval } = useUtils();

  const runAgent = async (bearer: string, agentId: string) => {
    setAgentRunError(null);
    try {
      const response = await fetch(`${server_url}/run-agent`, {
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
      console.log(err);
      setAgentRunError(err);
    }
  };

  const getAgentRun = async (bearer: string, agentId: string) => {
    setAgentRunError(null);
    try {
      const response = await fetch(`${server_url}/get-agent-run`, {
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
      console.log(err);
      setAgentRunError(err);
    }
  };

  const updateAgentRun = (newRun: any) => {
    if (newRun && "agent_id" in newRun) {
      setAgentRun(newRun);
    } else {
      setAgentRun(null);
      setPollInterval(null);
      setAgentRunLoading(false);
      return;
    }
    if (newRun.status === "running") {
      setPollInterval(5000);
    } else {
      setPollInterval(null);
      setAgentRunLoading(false);
    }
  };

  useInterval(() => {
    getAgentRun(bearer, agentId).then((data) => {
      updateAgentRun(data);
    });
  }, pollInterval);

  const runAgentAndPoll = async () => {
    setAgentRunLoading(true);
    const newAgent = await runAgent(bearer, agentId);
    updateAgentRun(newAgent);
  };

  const getAgentRunAndPoll = async () => {
    setAgentRunLoading(true);
    const newAgent = await getAgentRun(bearer, agentId);
    updateAgentRun(newAgent);
  };

  return {
    runAgentAndPoll,
    getAgentRunAndPoll,
    agentRun,
    agentRunLoading,
    agentRunError,
  };
}
