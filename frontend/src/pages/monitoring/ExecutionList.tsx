"use client";

import React, { useEffect, useState } from "react";
import * as SubframeCore from "@subframe/core";
import { TextField } from "@/subframe/components/TextField";
import { Table } from "@/subframe/components/Table";
import { Tooltip } from "@/subframe/components/Tooltip";
import { IconButton } from "@/subframe/components/IconButton";
import moment from "moment-timezone";
import { Execution } from "@/types";
import useUtils from "@/hooks/useUtils";

interface ExecutionListProps {
  executions: Array<Execution>;
  selectedRow: number;
  setSelectedRow: (index: number) => void;
  fetchExecutions: () => void;
}

export default function ExecutionList({
  executions,
  selectedRow,
  setSelectedRow,
  fetchExecutions,
}: ExecutionListProps) {
  const { calculateRuntime } = useUtils();

  function getStatusIcon(status: string): React.ReactNode {
    let iconName: SubframeCore.IconName;
    let iconColor: string;
    let tooltipText: string;
    switch (status) {
      case "success":
        iconName = "FeatherCheckCheck";
        iconColor = "text-success-600";
        tooltipText = "Success";
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

  return (
    <div className="flex max-w-[384px] h-full grow basis-0 flex-col items-start gap-6 self-stretch rounded-md bg-neutral-50 px-4 py-4">
      <div className="flex w-full flex-wrap items-center gap-4">
        <div className="flex grow shrink-0 basis-0 items-center gap-1">
          <TextField variant="filled" label="" helpText="" icon="FeatherSearch">
            <TextField.Input
              placeholder="Search history..."
              value=""
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
            />
          </TextField>
        </div>
        <div className="flex items-center gap-2 mobile:h-auto mobile:w-auto mobile:flex-none">
          <IconButton
            icon="FeatherRefreshCw"
            onClick={() => {
              fetchExecutions();
            }}
          />
          {/* <IconButton
            icon="FeatherSettings"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          /> */}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-2 overflow-auto rounded-md border border-solid border-neutral-border bg-default-background shadow-sm overflow-auto">
        <Table
          header={
            <Table.HeaderRow>
              <Table.HeaderCell>Execution ID</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Start Time</Table.HeaderCell>
            </Table.HeaderRow>
          }
        >
          {executions.map((execution, index) => (
            <Table.Row
              className={`cursor-pointer ${
                selectedRow == index ? "bg-brand-50" : ""
              }`}
              clickable={true}
              onClick={() => setSelectedRow(index)}
              key={index}
            >
              <Table.Cell>
                <div className="flex items-center gap-2">
                  {/* <SubframeCore.Icon
                    className="text-heading-3 font-heading-3 text-default-font"
                    name="FeatherTerminalSquare"
                  /> */}
                  <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                    {
                      // Limit the length of the execution ID to 8 characters
                      execution.id.length > 10
                        ? execution.id.substring(0, 10) + "..."
                        : execution.id
                    }
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>{getStatusIcon(execution.status)}</Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  {moment(execution.createdAt)
                    .tz("UTC")
                    .format("MMM D, h:mm A")}
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </div>
    </div>
  );
}
