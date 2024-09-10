"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as SubframeCore from "@subframe/core";
import { TextField } from "@/subframe/components/TextField";
import { Button } from "@/subframe/components/Button";
import { IconButton } from "@/subframe/components/IconButton";
import { Table } from "@/subframe/components/Table";
import { Checkbox } from "@/subframe/components/Checkbox";
import { Tooltip } from "@/subframe/components/Tooltip";
import { Badge } from "@/subframe/components/Badge";
import { Accordion } from "@/subframe/components/Accordion";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { DefaultPageLayout } from "@/layouts/DefaultPageLayout";
import { useUserStateContext } from "@/hooks/useAuth";
import { CopyToClipboardButton } from "@/subframe/components/CopyToClipboardButton";
import useFinicApp from "@/hooks/useFinicApp";
import { Agent } from "@/types";

export function MonitoringPage() {
  const [agents, setAgents] = useState<Array<Agent>>([]);
  const { createAgent, listAgents, setAgentStatus, isLoading } =
    useFinicApp();
  const { bearer } = useUserStateContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (bearer) {
      listAgents(bearer).then((data) => {
        if (data) {
          setAgents(data);
        }
      });
    }
  }, [bearer]);

  function handleCreateAgent() {
    createAgent(bearer).then((data) => {
      navigate(`/agent/${data.id}`);
    });
  }

  return (
    <DefaultPageLayout>
      <div className="flex w-full flex-col items-start gap-6 pt-6 pr-6 pb-6 pl-6">
        <div className="flex flex-col items-start gap-2">
          <span className="text-heading-1 font-heading-1 text-default-font">
            Monitoring
          </span>
          <span className="text-body font-body text-default-font">
            Monitor recent activity. View logs and error messages.
          </span>
        </div>
        <div className="flex w-full grow shrink-0 basis-0 items-start gap-6">
          <div className="flex max-w-[384px] grow shrink-0 basis-0 flex-col items-start gap-6 self-stretch rounded-md bg-neutral-50 px-4 py-4">
            <div className="flex w-full flex-wrap items-center gap-4">
              <div className="flex grow shrink-0 basis-0 items-center gap-1">
                <TextField
                  variant="filled"
                  label=""
                  helpText=""
                  icon="FeatherSearch"
                >
                  <TextField.Input
                    placeholder="Search history..."
                    value=""
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {}}
                  />
                </TextField>
              </div>
              <div className="flex items-center gap-2 mobile:h-auto mobile:w-auto mobile:flex-none">
                <IconButton
                  icon="FeatherRefreshCw"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
                <IconButton
                  icon="FeatherSettings"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </div>
            </div>
            <div className="flex w-full flex-wrap items-start gap-4 mobile:flex-col mobile:flex-wrap mobile:gap-4">
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
                <span className="line-clamp-1 w-full text-body-bold font-body-bold text-subtext-color">
                  Total executions
                </span>
                <span className="w-full text-heading-2 font-heading-2 text-default-font">
                  424
                </span>
              </div>
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
                <span className="line-clamp-1 w-full text-body-bold font-body-bold text-subtext-color">
                  Success rate
                </span>
                <span className="w-full text-heading-2 font-heading-2 text-default-font">
                  98.47%
                </span>
              </div>
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
                <span className="line-clamp-1 w-full text-body-bold font-body-bold text-subtext-color">
                  Avg. run time
                </span>
                <span className="w-full text-heading-2 font-heading-2 text-default-font">
                  15m 43s
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-2 overflow-hidden rounded-md border border-solid border-neutral-border bg-default-background shadow-sm overflow-auto">
              <Table
                header={
                  <Table.HeaderRow>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Agent Name</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Run Time</Table.HeaderCell>
                  </Table.HeaderRow>
                }
              >
                <Table.Row clickable={true}>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-500">
                      6h ago
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <SubframeCore.Icon
                        className="text-heading-3 font-heading-3 text-default-font"
                        name="FeatherTerminalSquare"
                      />
                      <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                        GCS to Snowflake
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <SubframeCore.Tooltip.Provider>
                      <SubframeCore.Tooltip.Root>
                        <SubframeCore.Tooltip.Trigger asChild={true}>
                          <SubframeCore.Icon
                            className="text-heading-3 font-heading-3 text-success-600"
                            name="FeatherCheckCheck"
                          />
                        </SubframeCore.Tooltip.Trigger>
                        <SubframeCore.Tooltip.Portal>
                          <SubframeCore.Tooltip.Content
                            side="bottom"
                            align="center"
                            sideOffset={4}
                            asChild={true}
                          >
                            <Tooltip>Last Run Successful</Tooltip>
                          </SubframeCore.Tooltip.Content>
                        </SubframeCore.Tooltip.Portal>
                      </SubframeCore.Tooltip.Root>
                    </SubframeCore.Tooltip.Provider>
                  </Table.Cell>
                  <Table.Cell>
                    <SubframeCore.Icon
                      className="text-body font-body text-subtext-color"
                      name="FeatherClock"
                    />
                    <span className="whitespace-nowrap text-body font-body text-neutral-500">
                      16m 58s
                    </span>
                  </Table.Cell>
                </Table.Row>
                <Table.Row clickable={true}>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-500">
                      3d ago
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <SubframeCore.Icon
                        className="text-heading-3 font-heading-3 text-default-font"
                        name="FeatherTerminalSquare"
                      />
                      <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                        Amazon Scraper
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <SubframeCore.Tooltip.Provider>
                      <SubframeCore.Tooltip.Root>
                        <SubframeCore.Tooltip.Trigger asChild={true}>
                          <SubframeCore.Icon
                            className="text-heading-3 font-heading-3 text-success-700"
                            name="FeatherCheckCheck"
                          />
                        </SubframeCore.Tooltip.Trigger>
                        <SubframeCore.Tooltip.Portal>
                          <SubframeCore.Tooltip.Content
                            side="bottom"
                            align="center"
                            sideOffset={4}
                            asChild={true}
                          >
                            <Tooltip>Draft</Tooltip>
                          </SubframeCore.Tooltip.Content>
                        </SubframeCore.Tooltip.Portal>
                      </SubframeCore.Tooltip.Root>
                    </SubframeCore.Tooltip.Provider>
                  </Table.Cell>
                  <Table.Cell>
                    <SubframeCore.Icon
                      className="text-body font-body text-subtext-color"
                      name="FeatherClock"
                    />
                    <span className="whitespace-nowrap text-body font-body text-neutral-500">
                      14m 23s
                    </span>
                  </Table.Cell>
                </Table.Row>
                <Table.Row clickable={true}>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-body font-body text-neutral-500">
                      12d ago
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <SubframeCore.Icon
                        className="text-heading-3 font-heading-3 text-default-font"
                        name="FeatherTerminalSquare"
                      />
                      <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                        Analyze support tickets
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <SubframeCore.Tooltip.Provider>
                      <SubframeCore.Tooltip.Root>
                        <SubframeCore.Tooltip.Trigger asChild={true}>
                          <SubframeCore.Icon
                            className="text-heading-3 font-heading-3 text-brand-600"
                            name="FeatherAlertOctagon"
                          />
                        </SubframeCore.Tooltip.Trigger>
                        <SubframeCore.Tooltip.Portal>
                          <SubframeCore.Tooltip.Content
                            side="bottom"
                            align="center"
                            sideOffset={4}
                            asChild={true}
                          >
                            <Tooltip>Last Run Failed</Tooltip>
                          </SubframeCore.Tooltip.Content>
                        </SubframeCore.Tooltip.Portal>
                      </SubframeCore.Tooltip.Root>
                    </SubframeCore.Tooltip.Provider>
                  </Table.Cell>
                  <Table.Cell>
                    <SubframeCore.Icon
                      className="text-body font-body text-subtext-color"
                      name="FeatherClock"
                    />
                    <span className="whitespace-nowrap text-body font-body text-neutral-500">
                      25m 0s
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table>
            </div>
          </div>
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 self-stretch rounded-md px-4 py-4 shadow-md">
            <div className="flex w-full flex-col items-start gap-1">
              <span className="text-heading-2 font-heading-2 text-default-font">
                Amazon Scraper
              </span>
              <span className="text-body-bold font-body-bold text-default-font">
                August 15, 2024 05:35:12 AM PDT
              </span>
              <span className="text-body-bold font-body-bold text-default-font">
                Ran for 16m 58s
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
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-6 overflow-hidden overflow-auto mobile:overflow-auto mobile:max-w-full" />
    </DefaultPageLayout>
  );
}

export default MonitoringPage;
