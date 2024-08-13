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
import { Switch } from "@/subframe/components/Switch";
import { DefaultPageLayout } from "@/subframe";
import { useUserStateContext } from "@/hooks/useAuth";
import useWorkflow from "@/hooks/useWorkflow";
import { Workflow } from "@/types";

function WorkflowRow({ bearer, initial_data }: { bearer: string, initial_data: Workflow }) {
  const [workflow, setWorkflow] = useState<Workflow>(initial_data);
  const { setWorkflowStatus } = useWorkflow();
  const navigate = useNavigate();
  
  function toggleStatus(workflowId: string, status: string) {
    setWorkflowStatus(bearer, workflowId, status).then((data) => {
      data.last_run = new Date();
      setWorkflow(data);
    });
  }

  return (
    <Table.Row
      key={workflow.id}
    >
      <Table.Cell>
        <Button
          disabled={false}
          variant="brand-primary"
          size="medium"
          icon={null}
          iconRight="FeatherArrowUpRight"
          loading={false}
          onClick={() => navigate(`/workflow/${workflow.id}`)}
        >
          Open
        </Button>
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <SubframeCore.Icon
            className="text-heading-3 font-heading-3 text-default-font"
            name="FeatherTerminalSquare"
          />
          <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
            {workflow.name}
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
                <Tooltip>
                  {workflow.status === "success"
                    ? "Last Run Successful"
                    : workflow.status === "failed"
                    ? "Last Run Failed"
                    : "Draft"}
                </Tooltip>
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
      {/* <Table.Cell>
        <Badge>
          {workflow.label ? workflow.label : ""}
        </Badge>
      </Table.Cell> */}
      <Table.Cell>
        <SubframeCore.Icon
          className="text-body font-body text-subtext-color"
          name="FeatherUser"
        />
        <span className="whitespace-nowrap text-body font-body text-neutral-500">
          {workflow.id}
        </span>
      </Table.Cell>
      <Table.Cell>
        <Switch
          checked={workflow.status === "deployed"}
          onCheckedChange={(checked: boolean) => {toggleStatus(workflow.id, checked ? "deployed" : "draft")}}
        />
      </Table.Cell>
    </Table.Row>
  );
}

export function WorkflowList() {
  const [workflows, setWorkflows] = useState<Array<Workflow>>([]);
  const { listWorkflows, setWorkflowStatus, isLoading } = useWorkflow();
  const { bearer } = useUserStateContext();
  
  useEffect(() => {
    if (bearer) {
      listWorkflows(bearer).then((data) => {
        console.log(data)
        setWorkflows(data);
      });
    }
  }, [bearer]);

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
                {/* <Table.HeaderCell>Label</Table.HeaderCell> */}
                <Table.HeaderCell>Workflow ID</Table.HeaderCell>
                <Table.HeaderCell>Active</Table.HeaderCell>
              </Table.HeaderRow>
            }
          >
            {!isLoading && workflows.map((workflow, index) => (
              <WorkflowRow bearer={bearer} initial_data={workflow}/>
            ))}
          </Table>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-6 overflow-hidden overflow-auto mobile:overflow-auto mobile:max-w-full" />
    </DefaultPageLayout>
  );
}

export default WorkflowList;
