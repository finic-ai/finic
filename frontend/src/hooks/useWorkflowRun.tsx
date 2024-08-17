import { useState, useEffect, useCallback } from "react";
import humps from "humps";
import { type Node, type Edge, type NodeTypes } from "@xyflow/react";
import { useAuth } from "@/hooks/useAuth";
import { Workflow } from "@/types";
import useUtils from "@/hooks/useUtils";
const server_url = import.meta.env.VITE_APP_SERVER_URL;

export function useWorkflowRun(bearer: string, workflowId: string) {
  const [workflowRunLoading, setWorkflowRunLoading] = useState<boolean>(false);
  const [workflowRunError, setWorkflowRunError] = useState<Error | null>(null);
  const [workflowRun, setWorkflowRun] = useState<any>(null);
  const [pollInterval, setPollInterval] = useState<number | null>(null);
  const { useInterval } = useUtils();

  const runWorkflow = async (bearer: string, workflowId: string) => {
    setWorkflowRunError(null);
    try {
      const response = await fetch(`${server_url}/run-workflow`, {
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
      console.log(err);
      setWorkflowRunError(err);
    }
  };

  const getWorkflowRun = async (bearer: string, workflowId: string) => {
    setWorkflowRunError(null);
    try {
      const response = await fetch(`${server_url}/get-workflow-run`, {
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
      console.log(err);
      setWorkflowRunError(err);
    }
  };

  const updateWorkflowRun = (newRun: any) => {
    if (newRun && "workflow_id" in newRun) {
      setWorkflowRun(newRun);
    } else {
      setWorkflowRun(null);
      setPollInterval(null);
      setWorkflowRunLoading(false);
      return;
    }
    if (newRun.status === "running") {
      setPollInterval(5000);
    } else {
      setPollInterval(null);
      setWorkflowRunLoading(false);
    }
  };

  useInterval(() => {
    getWorkflowRun(bearer, workflowId).then((data) => {
      updateWorkflowRun(data);
    });
  }, pollInterval);

  const runWorkflowAndPoll = async () => {
    setWorkflowRunLoading(true);
    const newWorkflow = await runWorkflow(bearer, workflowId);
    updateWorkflowRun(newWorkflow);
  };

  const getWorkflowRunAndPoll = async () => {
    setWorkflowRunLoading(true);
    const newWorkflow = await getWorkflowRun(bearer, workflowId);
    updateWorkflowRun(newWorkflow);
  };

  return {
    runWorkflowAndPoll,
    getWorkflowRunAndPoll,
    workflowRun,
    workflowRunLoading,
    workflowRunError,
  };
}
