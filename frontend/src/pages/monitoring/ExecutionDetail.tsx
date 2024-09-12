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

interface ExecutionDetailProps {
  selectedExecution: Execution;
}

export default function ExecutionDetail({ selectedExecution }: ExecutionDetailProps) {

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

  return (
    <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 self-stretch rounded-md px-4 py-4 shadow-md">
      <div className="flex w-full flex-col items-start gap-1">
        <span className="text-heading-2 font-heading-2 text-default-font">
          {selectedExecution?.userDefinedAgentId}
        </span>
        <span className="text-body-bold font-body-bold text-default-font">
          {moment(selectedExecution?.startTime).tz("UTC").format("MMMM D, YYYY h:mm:ss A")}
        </span>
        <span className="text-body-bold font-body-bold text-default-font">
          Ran for {calculateRuntime(selectedExecution)}
        </span>
      </div>
      <div className="flex w-full flex-col items-start gap-2">
        <span className="text-heading-3 font-heading-3 text-default-font">
          Logs
        </span>
        <div className="flex w-full flex-col items-end rounded-md bg-neutral-50 px-2 py-2">
          <CopyToClipboardButton
            clipboardText=""
            tooltipText="Copy to clipboard"
            icon="FeatherClipboard"
            onCopy={() => {}}
          />
          <span className="w-full whitespace-pre-wrap text-monospace-body font-monospace-body text-default-font overflow-y-auto">
            {
              "\n2023-09-08T12:00:21.456Z [INFO] Capturing screenshot of the search results.\n2023-09-08T12:00:22.789Z [INFO] Screenshot saved to /screenshots/search_results.png.\n\n2023-09-08T12:00:23.012Z [INFO] Starting cleanup process.\n2023-09-08T12:00:24.345Z [INFO] Closing browser instance.\n2023-09-08T12:00:25.678Z [INFO] Browser closed successfully.\n\n2023-09-08T12:00:26.789Z [INFO] Playwright container execution completed.\n2023-09-08T12:00:27.012Z [INFO] Exiting container.\n\n"
            }
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-2">
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
                  {
                    "// Add a bit of code here\n\n// And some more if needed..."
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
                  {
                    "// Add a bit of code here\n\n// And some more if needed..."
                  }
                </span>
              </div>
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
