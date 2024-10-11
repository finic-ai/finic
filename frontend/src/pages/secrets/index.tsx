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
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { Alert } from "@/subframe/components/Alert";
import { Select } from "@/subframe/components/Select";
import { DefaultPageLayout } from "@/layouts/DefaultPageLayout";
import { useUserStateContext } from "@/hooks/useAuth";
import useFinicApp from "@/hooks/useFinicApp";
import { FinicSecret } from "@/types";

interface SecretsRowProps {
  secret: FinicSecret;
}

export function SecretsRow({secret}: SecretsRowProps) {

  function handleDeleteSecret(agentId: string) {
  }

  function handleEditSecret(agentId: string) {
    // Configure refresh behavior
  }

  return (
    <Table.Row key={secret.id}>
      <Table.Cell>
      <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
        Amazon.com
      </span>
      </Table.Cell>
      <Table.Cell>
        <Select
          disabled={false}
          error={false}
          variant="outline"
          label=""
          placeholder="Password"
          helpText=""
          icon={null}
          value={undefined}
          onValueChange={(value: string) => {}}
        >
        <Select.Item value="Item 1">Password</Select.Item>
        <Select.Item value="Item 2">API Key</Select.Item>
        <Select.Item value="Item 3">Auth Token</Select.Item>
      </Select>
      </Table.Cell>
      <Table.Cell>
        <span className="whitespace-nowrap text-body font-body text-neutral-500">
          ...7cb3
        </span>
      </Table.Cell>
      <Table.Cell>
        <SubframeCore.Icon
          className="text-body font-body text-subtext-color"
          name="FeatherUser"
        />
        <span className="whitespace-nowrap text-body font-body text-neutral-500">
          amazon-user-1
        </span>
      </Table.Cell>
      <Table.Cell>
        <SubframeCore.Icon
          className="text-body font-body text-subtext-color"
          name="FeatherUser"
        />
        <span className="whitespace-nowrap text-body font-body text-neutral-500">
          {secret.id}
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
              <DropdownMenu.DropdownItem icon="FeatherEdit2" onClick={() => handleEditSecret(secret.id)}>
                Edit
              </DropdownMenu.DropdownItem>
              <DropdownMenu.DropdownItem icon="FeatherTrash" onClick={() => handleDeleteSecret(secret.id)}>
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

export default function SecretsPage() {
  const [secrets, setSecrets] = useState<Array<FinicSecret>>([]);
  const { bearer } = useUserStateContext();
  const { isLoading, error } = useFinicApp();

  const navigate = useNavigate();

  useEffect(() => {
    // if (bearer) {
    //   listAgents(bearer).then((data) => {
    //     if (data) {
    //       setAgents(data);
    //     }
    //   });
    // }
  }, [bearer]);
  
  return (
    <DefaultPageLayout>
      <div className="flex w-full flex-col items-start gap-6 pt-6 pr-6 pb-6 pl-6">
        <Alert
          variant="neutral"
          icon="FeatherLoader2"
          title="Amazon Scraper Running"
          description="Click here to view the status."
          actions={
            <IconButton
              size="medium"
              icon="FeatherX"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            />
          }
        />
        <div className="flex flex-col items-start gap-2">
          <span className="text-heading-1 font-heading-1 text-default-font">
            Secrets
          </span>
          <span className="text-body font-body text-default-font">
            Manage credentials your agents use to authenticate with services.
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
            {/* <IconButton
              icon="FeatherRefreshCw"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            />
            <IconButton
              icon="FeatherSettings"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            /> */}
            <Button
              variant="neutral-primary"
              icon="FeatherPlus"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Add Secret
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-2 overflow-hidden rounded border border-solid border-neutral-border bg-default-background shadow-default overflow-auto">
          <Table
            header={
              <Table.HeaderRow>
                <Table.HeaderCell />
                <Table.HeaderCell>Service Name</Table.HeaderCell>
                <Table.HeaderCell>Secret Type</Table.HeaderCell>
                <Table.HeaderCell>Secret ID</Table.HeaderCell>
                <Table.HeaderCell>Account ID</Table.HeaderCell>
                <Table.HeaderCell>-</Table.HeaderCell>
              </Table.HeaderRow>
            }
          >
            {!isLoading && secrets.length > 0
              ? secrets
                  .sort((a, b) => a.serviceName.localeCompare(b.serviceName))
                  .map((secret, index) => (
                    <SecretsRow secret={secret} />
                  ))
              : null}
          </Table>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-6 overflow-hidden overflow-auto mobile:overflow-auto mobile:max-w-full" />
    </DefaultPageLayout>
  );
}
