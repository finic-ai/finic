"use client";

import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { Accordion } from "@/subframe/components/Accordion";
import { DefaultPageLayout } from "@/layouts/DefaultPageLayout";
import { useUserStateContext } from "@/hooks/useAuth";
import { CopyToClipboardButton } from "@/subframe/components/CopyToClipboardButton";
import useFinicApp from "@/hooks/useFinicApp";
import { Execution } from "@/types";
import useUtils from "@/hooks/useUtils";
import * as SubframeCore from "@subframe/core";
import { Tooltip } from "@/subframe/components/Tooltip";

interface ExecutionDetailProps {
  selectedExecution: Execution;
}

export default function ExecutionDetail({
  selectedExecution,
}: ExecutionDetailProps) {
  // useEffect(() => {
  //   if (bearer) {
  //     listAgents(bearer).then((data) => {
  //       if (data) {
  //         setAgents(data);
  //       }
  //     });
  //   }
  // }, [bearer]);

  const { calculateRuntime } = useUtils();

  function getStatusIcon(status: string): React.ReactNode {
    let iconName: SubframeCore.IconName;
    let iconColor: string;
    let tooltipText: string;
    switch (status) {
      case "successful":
        iconName = "FeatherCheckCheck";
        iconColor = "text-success-600";
        tooltipText = "Successful";
        break;
      case "failed":
        iconName = "FeatherX";
        iconColor = "text-error-600";
        tooltipText = "Failed";
        break;
      case "running":
        iconName = "FeatherClock";
        iconColor = "text-neutral-600";
        tooltipText = "Running";
        break;
      default:
        iconName = "FeatherHelpCircle";
        iconColor = "text-error-600";
        tooltipText = "Invalid status";
    }
    return (
      <SubframeCore.Tooltip.Provider>
        <SubframeCore.Tooltip.Root>
          <SubframeCore.Tooltip.Trigger asChild={true}>
            <SubframeCore.Icon
              className={"text-heading-3 font-heading-3 " + iconColor}
              name={iconName}
            />
          </SubframeCore.Tooltip.Trigger>
          <SubframeCore.Tooltip.Portal>
            <SubframeCore.Tooltip.Content
              side="bottom"
              align="center"
              sideOffset={4}
              asChild={true}
            >
              <Tooltip>{tooltipText}</Tooltip>
            </SubframeCore.Tooltip.Content>
          </SubframeCore.Tooltip.Portal>
        </SubframeCore.Tooltip.Root>
      </SubframeCore.Tooltip.Provider>
    );
  }

  function getResults(execution: Execution): string {
    if (execution?.status === "running") {
      return "No results available while the execution is running.";
    } else {
      return (
        JSON.stringify(execution?.results, null, 2) ||
        "No results available for this run."
      );
    }
  }

  return (
    <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 self-stretch rounded-md px-4 py-4 shadow-md">
      <div className="flex w-full flex-col items-start gap-1">
        <div className="flex w-full items-center space-x-2">
          <span className="text-heading-2 font-heading-2 text-default-font">
            {selectedExecution?.id}
          </span>
          {getStatusIcon(selectedExecution?.status)}
        </div>
        <span className="text-body-bold font-body-bold text-default-font">
          Agent: {selectedExecution?.userDefinedAgentId}
        </span>
        <span className="text-body-bold font-body-bold text-default-font">
          {moment(selectedExecution?.startTime)
            .tz("UTC")
            .format("MMMM D, YYYY h:mm:ss A")}
        </span>
        <span className="text-body-bold font-body-bold text-default-font">
          {selectedExecution?.status != "running" &&
            calculateRuntime(selectedExecution)}
        </span>
      </div>
      {/* align it to the top */}

      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full items-center justify-between">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Results
          </span>
          <CopyToClipboardButton
            clipboardText=""
            tooltipText="Copy to clipboard"
            icon="FeatherClipboard"
            onCopy={() => {}}
          />
        </div>
        <div className="flex w-full flex-col items-end rounded-md bg-neutral-50 px-2 py-2">
          <span className="w-full whitespace-pre-wrap text-monospace-body font-monospace-body text-default-font overflow-y-auto">
            {getResults(selectedExecution)}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full items-center justify-between">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Logs
          </span>
          <CopyToClipboardButton
            clipboardText=""
            tooltipText="Copy to clipboard"
            icon="FeatherClipboard"
            onCopy={() => {}}
          />
        </div>

        <div className="flex w-full flex-col items-end rounded-md bg-neutral-50 px-2 py-2">
          <span className="w-full whitespace-pre-wrap text-monospace-body font-monospace-body text-default-font overflow-y-auto">
            {selectedExecution?.attempts
              .map((attempt) => {
                for (const log of attempt.logs) {
                  return `[${log.severity}] ${log.message}`;
                }
              })
              .join("\n")}
          </span>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="flex w-full flex-col items-start gap-2">
        <span className="text-heading-3 font-heading-3 text-default-font">
          Errors
        </span>
        <div className="flex w-full flex-col items-start">
          <Accordion
            trigger={
              <div className="flex w-full items-center gap-2 px-4 py-3">
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-error-700">
                    1m 14s
                  </span>
                  <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-error-700">
                    RuntimeError
                  </span>
                </div>
                <Accordion.Chevron />
              </div>
            }
            defaultOpen={true}
          >
            <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-4 pb-4">
              <div className="flex w-full flex-col items-start gap-4 rounded-md bg-neutral-50 px-2 py-2">
                <span className="w-full whitespace-pre-wrap text-monospace-body font-monospace-body text-default-font">
                  {
                    'Traceback (most recent call last):\n  File "example.py", line 10, in <module>\n    main()\n  File "example.py", line 6, in main\n    result = divide_numbers(10, 0)\n  File "example.py", line 4, in divide_numbers\n    return a / b\nZeroDivisionError: division by zero\n'
                  }
                </span>
              </div>
            </div>
          </Accordion>
          <Accordion
            trigger={
              <div className="flex w-full items-center gap-2 px-4 py-3">
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-error-700">
                    4m 54s
                  </span>
                  <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-error-700">
                    AuthError
                  </span>
                </div>
                <Accordion.Chevron />
              </div>
            }
          >
            <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-4 pb-4">
              <div className="flex w-full flex-col items-start gap-4 rounded-md bg-neutral-50 px-2 py-2">
                <span className="w-full whitespace-pre-wrap text-monospace-body font-monospace-body text-default-font">
                  {"// Add a bit of code here\n\n// And some more if needed..."}
                </span>
              </div>
            </div>
          </Accordion>
          <Accordion
            trigger={
              <div className="flex w-full items-center gap-2 px-4 py-3">
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-error-700">
                    7m 42s
                  </span>
                  <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-error-700">
                    RuntimeError
                  </span>
                </div>
                <Accordion.Chevron />
              </div>
            }
          >
            <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-4 pb-4">
              <div className="flex w-full flex-col items-start gap-4 rounded-md bg-neutral-50 px-2 py-2">
                <span className="w-full whitespace-pre-wrap text-monospace-body font-monospace-body text-default-font">
                  {"// Add a bit of code here\n\n// And some more if needed..."}
                </span>
              </div>
            </div>
          </Accordion>
        </div>
      </div> */
}
