"use client";

import React, { useEffect, useState } from "react";
import { Accordion } from "@/subframe/components/Accordion";
import { DefaultPageLayout } from "@/layouts/DefaultPageLayout";
import { useUserStateContext } from "@/hooks/useAuth";
import { CopyToClipboardButton } from "@/subframe/components/CopyToClipboardButton";
import { Button } from "@/subframe/components/Button";
import { Badge } from "@/subframe/components/Badge";
import useFinicApp from "@/hooks/useFinicApp";
import { Agent, Execution } from "@/types";
import ExecutionList from "../monitoring/ExecutionList";
import ExecutionDetail from "../monitoring/ExecutionDetail";
import { useParams } from "react-router-dom";
import { RunAgentModal } from "@/components/Modals";

export function AgentPage() {
  const { id } = useParams();
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [agent, setAgent] = useState<Agent | undefined>(undefined);
  const { listExecutions, getAgent, error, isLoading } = useFinicApp();
  const { bearer } = useUserStateContext();
  const [runAgentModalOpen, setRunAgentModalOpen] = useState(false);

  async function fetchExecutions() {
    if (bearer && id) {
      const data = await listExecutions(id);
      if (data) {
        setExecutions(data);
      }
    }
  }
  async function fetchAgent() {
    if (bearer && id) {
      const data = await getAgent(id);
      if (data) {
        setAgent(data);
      }
    }
  }

  useEffect(() => {
    fetchAgent();
    fetchExecutions();
  }, [bearer]);

  return (
    <DefaultPageLayout>
      <RunAgentModal
        isOpen={runAgentModalOpen}
        setIsOpen={setRunAgentModalOpen}
        setNewExecution={(execution: Execution) => {
          fetchExecutions();
        }}
        agentId={id!}
      />
      <div className="flex w-full h-full flex-col items-start gap-6 pt-6 pr-6 pb-6 pl-6">
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full items-center justify-between">
            <span className="text-heading-1 font-heading-1 text-default-font">
              {agent?.description}
            </span>
            <Button
              disabled={false}
              variant="brand-primary"
              size="medium"
              iconRight="FeatherPlay"
              loading={false}
              onClick={() => setRunAgentModalOpen(true)}
            >
              Run
            </Button>
          </div>
          <span className="text-heading-3 font-heading-3 text-default-font">
            {agent?.id}
          </span>
          <Badge>Max retries: 3</Badge>
        </div>
        <div className="flex w-full grow h-full basis-0 items-start gap-6">
          <ExecutionList
            executions={executions}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            fetchExecutions={fetchExecutions}
          />
          {executions.length > 0 ? (
            <ExecutionDetail selectedExecution={executions[selectedRow]} />
          ) : null}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-6 overflow-hidden overflow-auto mobile:overflow-auto mobile:max-w-full" />
    </DefaultPageLayout>
  );
}

export default AgentPage;
