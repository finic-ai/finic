"use client";

import React from "react";
import { Breadcrumbs } from "@/subframe/components/Breadcrumbs";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import * as SubframeCore from "@subframe/core";
import { Avatar } from "@/subframe/components/Avatar";
import { TextField } from "@/subframe/components/TextField";
import { Button } from "@/subframe/components/Button";
import { IconButton } from "@/subframe/components/IconButton";
import { Table } from "@/subframe/components/Table";
import { Checkbox } from "@/subframe/components/Checkbox";
import { Tooltip } from "@/subframe/components/Tooltip";
import { Badge } from "@/subframe/components/Badge";
import { Switch } from "@/subframe/components/Switch";
import { DefaultPageLayout } from "@/subframe";

import { useAvailableWorkflows } from "../../hooks/useWorkflow";

export function WorkflowList() {
  // const [workflows, setWorkflows] = useAvailableWorkflows();

  return (
    <DefaultPageLayout>
      <div className="flex w-full flex-col items-start gap-6 pt-6 pr-6 pb-6 pl-6">
        <div className="flex w-full flex-wrap items-center gap-4">
          <div className="flex grow shrink-0 basis-0 items-center gap-1">
            <TextField
              variant="filled"
              label=""
              helpText=""
              icon="FeatherSearch"
            >
              <TextField.Input
                placeholder="Search workflows..."
                value=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </TextField>
            <Button
              variant="neutral-tertiary"
              iconRight="FeatherChevronDown"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Last 7 days
            </Button>
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
            <Button
              className="mobile:h-8 mobile:w-auto mobile:flex-none"
              icon="FeatherPlus"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              New Workflow
            </Button>
          </div>
        </div>
        {/* <div className="flex w-full flex-wrap items-start gap-4 mobile:flex-col mobile:flex-wrap mobile:gap-4">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default">
            <span className="line-clamp-1 w-full text-body-bold font-body-bold text-subtext-color">
              Total workflows
            </span>
            <span className="w-full text-heading-1 font-heading-1 text-default-font">
              424
            </span>
          </div>
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default">
            <span className="line-clamp-1 w-full text-body-bold font-body-bold text-subtext-color">
              Success rate
            </span>
            <span className="w-full text-heading-1 font-heading-1 text-default-font">
              98.47%
            </span>
          </div>
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default">
            <span className="line-clamp-1 w-full text-body-bold font-body-bold text-subtext-color">
              Avg. run time
            </span>
            <span className="w-full text-heading-1 font-heading-1 text-default-font">
              5m 43s
            </span>
          </div>
        </div> */}
        <div className="flex w-full flex-col items-start gap-2 overflow-hidden rounded border border-solid border-neutral-border bg-default-background shadow-default overflow-auto">
          <Table
            header={
              <Table.HeaderRow>
                <Table.HeaderCell />
                <Table.HeaderCell>Workflow</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Last Run</Table.HeaderCell>
                <Table.HeaderCell>Label</Table.HeaderCell>
                <Table.HeaderCell>Workflow ID</Table.HeaderCell>
                <Table.HeaderCell>Active</Table.HeaderCell>
              </Table.HeaderRow>
            }
          >
            <Table.Row clickable={true}>
              <Table.Cell>
                <Checkbox
                  label=""
                  checked={false}
                  onCheckedChange={(checked: boolean) => {}}
                />
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
                  1.8s
                </span>
              </Table.Cell>
              <Table.Cell>
                <Badge>Input</Badge>
              </Table.Cell>
              <Table.Cell>
                <SubframeCore.Icon
                  className="text-body font-body text-subtext-color"
                  name="FeatherUser"
                />
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  WF-47301-38581
                </span>
              </Table.Cell>
              <Table.Cell>
                <Switch
                  checked={false}
                  onCheckedChange={(checked: boolean) => {}}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row clickable={true}>
              <Table.Cell>
                <Checkbox
                  label=""
                  checked={false}
                  onCheckedChange={(checked: boolean) => {}}
                />
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
                        className="text-heading-3 font-heading-3 text-neutral-600"
                        name="FeatherDraftingCompass"
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
                  1.8s
                </span>
              </Table.Cell>
              <Table.Cell>
                <Badge>Input</Badge>
              </Table.Cell>
              <Table.Cell>
                <SubframeCore.Icon
                  className="text-body font-body text-subtext-color"
                  name="FeatherUser"
                />
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  WF-47301-38581
                </span>
              </Table.Cell>
              <Table.Cell>
                <Switch
                  checked={false}
                  onCheckedChange={(checked: boolean) => {}}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row clickable={true}>
              <Table.Cell>
                <Checkbox
                  label=""
                  checked={false}
                  onCheckedChange={(checked: boolean) => {}}
                />
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <SubframeCore.Icon
                    className="text-heading-3 font-heading-3 text-default-font"
                    name="FeatherTerminalSquare"
                  />
                  <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                    Salesforce + Marketo -&gt; Snowflake
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
                  2.3s
                </span>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="neutral">Output</Badge>
              </Table.Cell>
              <Table.Cell>
                <SubframeCore.Icon
                  className="text-body font-body text-subtext-color"
                  name="FeatherUser"
                />
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  WF-47301-38581
                </span>
              </Table.Cell>
              <Table.Cell>
                <Switch
                  checked={false}
                  onCheckedChange={(checked: boolean) => {}}
                />
              </Table.Cell>
            </Table.Row>
          </Table>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-6 overflow-hidden overflow-auto mobile:overflow-auto mobile:max-w-full" />
    </DefaultPageLayout>
  );
}

export default WorkflowList;
