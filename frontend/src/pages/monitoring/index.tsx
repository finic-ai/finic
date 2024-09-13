"use client";

import React, { useEffect, useState } from "react";
import { Accordion } from "@/subframe/components/Accordion";
import { DefaultPageLayout } from "@/layouts/DefaultPageLayout";
import { useUserStateContext } from "@/hooks/useAuth";
import { CopyToClipboardButton } from "@/subframe/components/CopyToClipboardButton";
import useFinicApp from "@/hooks/useFinicApp";
import { Agent, Execution } from "@/types";
import ExecutionList from "./ExecutionList";
import ExecutionDetail from "./ExecutionDetail";

export function MonitoringPage() {
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const { listExecutions, error, isLoading } = useFinicApp();
  const { bearer } = useUserStateContext();

  function fetchExecutions() {
    if (bearer) {
      listExecutions().then((data) => {
        if (data) {
          setExecutions(data);
        }
      });
    }
  }

  useEffect(() => {
    fetchExecutions();
  }, [bearer]);

  return (
    <DefaultPageLayout>
      <div className="flex w-full flex-col items-start gap-6 pt-6 pr-6 pb-6 pl-6">
        <div className="flex flex-col items-start gap-2">
          <span className="text-heading-1 font-heading-1 text-default-font">
            Monitoring
          </span>
          <span className="text-body font-body text-default-font">
            View logs and error messages for recent executions.
          </span>
        </div>
        <div className="flex w-full grow shrink-0 basis-0 items-start gap-6">
          <ExecutionList 
            executions={executions} 
            selectedRow={selectedRow} 
            setSelectedRow={setSelectedRow}
            fetchExecutions={fetchExecutions}
          />
          {executions.length > 0 ? <ExecutionDetail selectedExecution={executions[selectedRow]} /> : null}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-6 overflow-hidden overflow-auto mobile:overflow-auto mobile:max-w-full" />
    </DefaultPageLayout>
  );
}

export default MonitoringPage;
