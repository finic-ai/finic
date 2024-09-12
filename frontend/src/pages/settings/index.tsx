"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as SubframeCore from "@subframe/core";
import { TextField } from "@/subframe/components/TextField";
import { Button } from "@/subframe/components/Button";
import { IconButton } from "@/subframe/components/IconButton";
import { Table } from "@/subframe/components/Table";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { Alert } from "@/subframe";
import { CopyToClipboardField } from "@/subframe/components/CopyToClipboardField";
import { DefaultPageLayout } from "@/layouts/DefaultPageLayout";
import { useUserStateContext } from "@/hooks/useAuth";
import useFinicApp from "@/hooks/useFinicApp";
import { Agent } from "@/types";

export default function SettingsPage() {
  const [keys, setKeys] = useState<string[]>(["test1", "test2"]);
  const { bearer } = useUserStateContext();

  useEffect(() => {
    if (bearer) {
      // listAgents(bearer).then((data) => {
      //   if (data) {
      //     setAgents(data);
      //   }
      // });
    }
  }, [bearer]);

  function handleCreateAPIKey() {
    // createAgent(bearer).then((data) => {
    //   navigate(`/agent/${data.id}`);
    // });
  }

  function handleDeleteAPIKey() {
  }

  function renderKeyRow(key: string) {
    const obfuscatedKey = "••••••••••••" + key.slice(-4);
    return (
      <Table.Row key={key}>
        <Table.Cell>
          <CopyToClipboardField
            className="h-auto grow shrink-0 basis-0"
            text={obfuscatedKey}
          />
        </Table.Cell>
        <Table.Cell>
          <span className="text-body font-body text-neutral-500">
            Feb 28, 2023
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="text-body font-body text-neutral-500">
            Mar 16, 2023
          </span>
        </Table.Cell>
        <Table.Cell>
          <SubframeCore.DropdownMenu.Root>
            <SubframeCore.DropdownMenu.Trigger asChild={true}>
              <IconButton
                size="medium"
                icon="FeatherMoreHorizontal"
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement>
                ) => {}}
              />
            </SubframeCore.DropdownMenu.Trigger>
            <SubframeCore.DropdownMenu.Portal>
              <SubframeCore.DropdownMenu.Content
                side="bottom"
                align="end"
                sideOffset={8}
                asChild={true}
              >
                <DropdownMenu className="h-auto w-auto min-w-[128px] flex-none">
                  <DropdownMenu.DropdownItem icon="FeatherMinusCircle">
                    Remove
                  </DropdownMenu.DropdownItem>
                </DropdownMenu>
              </SubframeCore.DropdownMenu.Content>
            </SubframeCore.DropdownMenu.Portal>
          </SubframeCore.DropdownMenu.Root>
        </Table.Cell>
      </Table.Row>
    )
  }

  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full items-start mobile:flex-col mobile:gap-0">
        <div className="container max-w-none flex grow shrink-0 basis-0 flex-col items-center gap-6 self-stretch bg-default-background py-12 shadow-sm">
          <div className="flex w-full max-w-[576px] flex-col items-start gap-12">
            <div className="flex w-full flex-col items-start gap-1">
              <span className="w-full text-heading-2 font-heading-2 text-default-font">
                API keys
              </span>
              <span className="w-full text-body font-body text-subtext-color">
                Generate, manage, and revoke your API access keys.
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-6">
              <div className="flex w-full items-center gap-2">
                <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font">
                  API keys
                </span>
                <Button
                  variant="neutral-primary"
                  size="medium"
                  icon="FeatherPlus"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  Create key
                </Button>
              </div>
              <Alert
                variant="brand"
                icon="FeatherLock"
                title="Your API keys are highly sensitive and secret"
                description="Never share your API keys with others or expose them in client-side code"
              />
              <div className="flex w-full flex-col items-start gap-6 overflow-auto">
                <Table
                  header={
                    <Table.HeaderRow>
                      <Table.HeaderCell>Key</Table.HeaderCell>
                      <Table.HeaderCell>Created</Table.HeaderCell>
                      <Table.HeaderCell>Last used</Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.HeaderRow>
                  }
                >
                  {keys.map((key) => renderKeyRow(key))}
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}