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
import { Execution } from "@/types";

interface ExecutionListProps {
  executions: Array<Execution>;
}

export default function ExecutionList({ executions }: ExecutionListProps) {

  // useEffect(() => {
  //   if (bearer) {
  //     listAgents(bearer).then((data) => {
  //       if (data) {
  //         setAgents(data);
  //       }
  //     });
  //   }
  // }, [bearer]);

  function getStatusIconName(status: string): SubframeCore.IconName {
    switch (status) {
      case "successful":
        return "FeatherCheckCheck";
      case "failed":
        return "FeatherX";
      case "running":
        return "FeatherClock";
      default:
        return "FeatherHelpCircle";
    }
  }

  function calculateRuntime(execution: Execution): string {
    if (!execution.startTime || !execution.endTime) {
      return "N/A";
    }

    try {
      const start = new Date(execution.startTime);
      const end = new Date(execution.endTime);
      const diff = end.getTime() - start.getTime();
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      return `${hours}h ${minutes}m ${seconds}s`;
    } catch (error) {
      return "N/A";
    }
  }

  return (
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
        {/* <div className="flex items-center gap-2 mobile:h-auto mobile:w-auto mobile:flex-none">
          <IconButton
            icon="FeatherRefreshCw"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          />
          <IconButton
            icon="FeatherSettings"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          />
        </div> */}
      </div>
      {/* <div className="flex w-full flex-wrap items-start gap-4 mobile:flex-col mobile:flex-wrap mobile:gap-4">
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
      </div> */}
      <div className="flex w-full flex-col items-start gap-2 overflow-auto rounded-md border border-solid border-neutral-border bg-default-background shadow-sm overflow-auto">
        <Table
          header={
            <Table.HeaderRow>
              <Table.HeaderCell />
              <Table.HeaderCell>Agent ID</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Run Time</Table.HeaderCell>
            </Table.HeaderRow>
          }
        >
          {executions.map((execution) => 
            <Table.Row clickable={true}>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  {execution.startTime}
                </span>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <SubframeCore.Icon
                    className="text-heading-3 font-heading-3 text-default-font"
                    name="FeatherTerminalSquare"
                  />
                  <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                    {execution.userDefinedAgentId}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <SubframeCore.Tooltip.Provider>
                  <SubframeCore.Tooltip.Root>
                    <SubframeCore.Tooltip.Trigger asChild={true}>
                      <SubframeCore.Icon
                        className="text-heading-3 font-heading-3 text-success-600"
                        name={getStatusIconName(execution.status)}
                      />
                    </SubframeCore.Tooltip.Trigger>
                    <SubframeCore.Tooltip.Portal>
                      <SubframeCore.Tooltip.Content
                        side="bottom"
                        align="center"
                        sideOffset={4}
                        asChild={true}
                      >
                        <Tooltip>Successful</Tooltip>
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
                  {calculateRuntime(execution)}
                </span>
              </Table.Cell>
            </Table.Row>)}
          {/* <Table.Row clickable={true}>
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
          </Table.Row> */}
        </Table>
      </div>
    </div>
  );
};
