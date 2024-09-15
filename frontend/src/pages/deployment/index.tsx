"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import * as SubframeCore from "@subframe/core";
import { TextField } from "@/subframe/components/TextField";
import { Button } from "@/subframe/components/Button";
import { IconButton } from "@/subframe/components/IconButton";
import { Table } from "@/subframe/components/Table";
import { Checkbox } from "@/subframe/components/Checkbox";
import { Tooltip } from "@/subframe/components/Tooltip";
import { Badge } from "@/subframe/components/Badge";
import { Switch } from "@/subframe/components/Switch";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { Alert } from "@/subframe/components/Alert";
import { DefaultPageLayout } from "@/layouts/DefaultPageLayout";
import { useUserStateContext } from "@/hooks/useAuth";
import useFinicApp from "@/hooks/useFinicApp";
import { Agent, Execution } from "@/types";
import { RunAgentModal } from "@/components/Modals";

interface AgentRowProps {
  bearer: string;
  initial_data: Agent;
  openRunAgentModal: () => void;
  setSelectedAgentId: (agentId: string) => void;
}

function AgentRow({
  bearer,
  initial_data,
  openRunAgentModal,
  setSelectedAgentId,
}: AgentRowProps) {
  const [agent, setAgent] = useState<Agent>(initial_data);
  const navigate = useNavigate();

  function handleClickRunAgent() {
    openRunAgentModal();
    setSelectedAgentId(agent.id);
  }

  function handleDeleteAgent(agentId: string) {}

  function handleEditAgent(agentId: string) {}

  return (
    <Table.Row
      className="hover:bg-neutral-100 cursor-pointer"
      key={agent.id}
      onClick={() => {
        navigate(`/agent/${agent.id}`);
      }}
    >
      <Table.Cell>
        <Button
          disabled={false}
          variant="neutral-primary"
          size="medium"
          icon={null}
          iconRight="FeatherArrowUpRight"
          loading={false}
          onClick={() => handleClickRunAgent()}
        >
          Run
        </Button>
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <SubframeCore.Icon
            className="text-heading-3 font-heading-3 text-default-font"
            name="FeatherTerminalSquare"
          />
          <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
            {agent.id}
          </span>
        </div>
      </Table.Cell>
      <Table.Cell>
        <span className="whitespace-nowrap text-body font-body text-neutral-500">
          {agent.description}
        </span>
      </Table.Cell>
      <Table.Cell>
        <SubframeCore.Tooltip.Provider>
          <SubframeCore.Tooltip.Root>
            <SubframeCore.Tooltip.Trigger asChild={true}>
              <SubframeCore.Icon
                className="text-heading-3 font-heading-3 text-success-600"
                name={
                  agent.status === "deployed"
                    ? "FeatherCheckCheck"
                    : agent.status === "deploying"
                    ? "FeatherClock"
                    : "FeatherAlertOctagon"
                }
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
                  {agent.status === "deployed"
                    ? "Deployed"
                    : agent.status === "deploying"
                    ? "Deploying..."
                    : "Deploy Failed"}
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
          {moment(agent.createdAt).tz("UTC").format("YYYY-MM-DD HH:mm:ss")}
        </span>
      </Table.Cell>
      <Table.Cell>
        <SubframeCore.DropdownMenu.Root>
          <SubframeCore.DropdownMenu.Trigger asChild={true}>
            <IconButton
              variant="neutral-secondary"
              icon="FeatherMoreHorizontal"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            />
          </SubframeCore.DropdownMenu.Trigger>
          <SubframeCore.DropdownMenu.Portal>
            <SubframeCore.DropdownMenu.Content
              side="bottom"
              align="start"
              sideOffset={4}
              asChild={true}
            >
              <DropdownMenu>
                <DropdownMenu.DropdownItem
                  icon="FeatherEdit2"
                  onClick={() => handleEditAgent(agent.id)}
                >
                  Edit
                </DropdownMenu.DropdownItem>
                <DropdownMenu.DropdownItem
                  icon="FeatherTrash"
                  onClick={() => handleDeleteAgent(agent.id)}
                >
                  Delete
                </DropdownMenu.DropdownItem>
              </DropdownMenu>
            </SubframeCore.DropdownMenu.Content>
          </SubframeCore.DropdownMenu.Portal>
        </SubframeCore.DropdownMenu.Root>
      </Table.Cell>
    </Table.Row>
  );
}

export function DeploymentPage() {
  const [agents, setAgents] = useState<Array<Agent>>([]);
  const [runAgentModalOpen, setRunAgentModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [newExecution, setNewExecution] = useState<Execution | null>(null);
  const { isLoading, listAgents } = useFinicApp();
  const { bearer } = useUserStateContext();
  const navigate = useNavigate();

  function fetchAgents() {
    if (bearer) {
      listAgents().then((data) => {
        if (data) {
          setAgents(data);
        }
      });
    }
  }

  useEffect(() => {
    fetchAgents();
  }, [bearer]);

  return (
    <DefaultPageLayout>
      <RunAgentModal
        isOpen={runAgentModalOpen}
        setIsOpen={setRunAgentModalOpen}
        setNewExecution={setNewExecution}
        agentId={selectedAgentId}
      />
      <div className="flex w-full flex-col items-start gap-6 py-6 px-48 ">
        {newExecution ? (
          <Alert
            variant="neutral"
            icon="FeatherRocket"
            title="We have liftoff!"
            description={`Agent ${selectedAgentId} is now running.`}
            actions={
              <>
                <Button
                  disabled={false}
                  variant="neutral-secondary"
                  size="medium"
                  icon={null}
                  iconRight={null}
                  loading={false}
                  onClick={() => {
                    navigate(`/monitoring`);
                  }}
                >
                  View Status
                </Button>
                <IconButton
                  size="medium"
                  icon="FeatherX"
                  onClick={() => {
                    setNewExecution(null);
                  }}
                />
              </>
            }
          />
        ) : null}
        <div className="flex flex-col items-start gap-2">
          <span className="text-heading-1 font-heading-1 text-default-font">
            Agents
          </span>
          <span className="text-body font-body text-default-font">
            View, edit, and run your deployed agents.
          </span>
        </div>
        <div className="flex w-full flex-wrap items-center gap-4">
          <div className="flex grow shrink-0 basis-0 items-center gap-1">
            {/* <TextField
              variant="filled"
              label=""
              helpText=""
              icon="FeatherSearch"
            >
              <TextField.Input
                placeholder="Search agents..."
                value=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </TextField> */}
            {/* <Button
              variant="neutral-tertiary"
              iconRight="FeatherChevronDown"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Last 7 days
            </Button> */}
          </div>
          <div className="flex items-center gap-2 mobile:h-auto mobile:w-auto mobile:flex-none">
            <IconButton
              icon="FeatherRefreshCw"
              onClick={() => {
                fetchAgents();
              }}
            />
            {/* <IconButton
              icon="FeatherSettings"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            /> */}
            <Button
              className="mobile:h-8 mobile:w-auto mobile:flex-none"
              icon="FeatherPlus"
            >
              New Agent
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-2 overflow-hidden rounded border border-solid border-neutral-border bg-default-background shadow-default overflow-auto">
          <Table
            header={
              <Table.HeaderRow>
                <Table.HeaderCell />
                <Table.HeaderCell>Agent ID</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Date Created</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.HeaderRow>
            }
          >
            {!isLoading && agents.length > 0
              ? agents
                  .sort((a, b) => a.id.localeCompare(b.id))
                  .map((agent, index) => (
                    <AgentRow
                      bearer={bearer}
                      initial_data={agent}
                      openRunAgentModal={() => setRunAgentModalOpen(true)}
                      setSelectedAgentId={setSelectedAgentId}
                      key={index}
                    />
                  ))
              : null}
          </Table>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-6 overflow-hidden overflow-auto mobile:overflow-auto mobile:max-w-full" />
    </DefaultPageLayout>
  );
}

export default DeploymentPage;
