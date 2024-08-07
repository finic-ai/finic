"use client";

import React from "react";
import { ReactFlowProvider, type NodeTypes } from "@xyflow/react";
import * as SubframeCore from "@subframe/core";
import { EditorTopBar } from "@/components/TopBar";
import { SidebarTile } from "../../../../../frontend/src/subframe/components/SidebarTile";
import { SidebarButton } from "../../../../../frontend/src/subframe/components/SidebarButton";
import { ToggleGroup } from "../../../../../frontend/src/subframe/components/ToggleGroup";
import { Breadcrumbs } from "../../../../../frontend/src/subframe/components/Breadcrumbs";
import { Avatar } from "../../../../../frontend/src/subframe/components/Avatar";
import { IconButton } from "../../../../../frontend/src/subframe/components/IconButton";
import { DropdownMenu } from "../../../../../frontend/src/subframe/components/DropdownMenu";
import { Button } from "../../../../../frontend/src/subframe/components/Button";

import { FinicNodeType } from "@/types";

interface SettingsPageLayoutProps {
  children?: React.ReactNode;
  className?: string;
  selectedPage: string;
}

export const SettingsPageLayout = React.forwardRef<
  HTMLElement,
  SettingsPageLayoutProps
>(function WorkflowPageLayoutRoot(
  { children, className, ...otherProps }: SettingsPageLayoutProps,
  ref
) {
  return (
    <div className="flex flex-col h-screen bg-default-background">
      <div className="flex w-full items-center gap-2 border-b border-solid border-neutral-border bg-default-background pt-3 pr-4 pb-3 pl-4">
        <div className="flex grow shrink-0 basis-0 items-center gap-4">
          <img
            className="h-6 flex-none"
            src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
          />
          <ToggleGroup>
            <ToggleGroup.Item icon={null} value="2f498b92">
              Editor
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="b1b04b29">
              Preview
            </ToggleGroup.Item>
          </ToggleGroup>
        </div>
        <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-2 self-stretch">
          <Breadcrumbs>
            <Breadcrumbs.Item>Example Workflow</Breadcrumbs.Item>
            <Breadcrumbs.Divider />
            <Breadcrumbs.Item>Settings</Breadcrumbs.Item>
            <Breadcrumbs.Divider />
            <Breadcrumbs.Item active={true}>Setting Page Name</Breadcrumbs.Item>
          </Breadcrumbs>
        </div>
        <div className="flex grow shrink-0 basis-0 items-center justify-end gap-2 self-stretch">
          <Avatar
            size="small"
            image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
          >
            AB
          </Avatar>
          <IconButton icon="FeatherSearch" />
          <SubframeCore.DropdownMenu.Root>
            <SubframeCore.DropdownMenu.Trigger asChild={true}>
              <IconButton icon="FeatherMoreHorizontal" />
            </SubframeCore.DropdownMenu.Trigger>
            <SubframeCore.DropdownMenu.Portal>
              <SubframeCore.DropdownMenu.Content
                side="bottom"
                align="end"
                sideOffset={4}
                asChild={true}
              >
                <DropdownMenu>
                  <DropdownMenu.DropdownItem icon="FeatherFile">
                    Save draft
                  </DropdownMenu.DropdownItem>
                  <DropdownMenu.DropdownItem icon="FeatherWrench">
                    Advanced settings
                  </DropdownMenu.DropdownItem>
                  <DropdownMenu.DropdownItem icon="FeatherTrash">
                    Delete
                  </DropdownMenu.DropdownItem>
                </DropdownMenu>
              </SubframeCore.DropdownMenu.Content>
            </SubframeCore.DropdownMenu.Portal>
          </SubframeCore.DropdownMenu.Root>
          <Button>Publish</Button>
        </div>
      </div>
      <div className="flex h-full w-full flex-col items-start bg-default-background">
        <div className="flex w-60 grow shrink-0 basis-0 flex-col items-start gap-8 bg-brand-50 pt-6 pr-6 pb-6 pl-6">
          <span className="w-full text-heading-3 font-heading-3 text-default-font">
            Settings
          </span>
          <div className="flex w-full flex-col items-start gap-2">
            <span className="w-full text-body-bold font-body-bold text-default-font">
              Workflow
            </span>
            <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name="FeatherBellRing"
              />
              <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
                Alerts
              </span>
            </div>
            <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name="FeatherCalendarClock"
              />
              <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
                Scheduling
              </span>
            </div>
            <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name="FeatherPlaneTakeoff"
              />
              <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
                Deployment
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <span className="w-full text-body-bold font-body-bold text-default-font">
              Workspace
            </span>
            <div className="flex w-full flex-col items-start gap-1">
              <div className="flex h-8 w-full flex-none items-center gap-2 rounded bg-brand-100 pt-1 pr-3 pb-1 pl-3">
                <SubframeCore.Icon
                  className="text-body font-body text-brand-700"
                  name="FeatherUser"
                />
                <span className="line-clamp-1 grow shrink-0 basis-0 text-body-bold font-body-bold text-brand-700">
                  Account
                </span>
              </div>
              <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
                <SubframeCore.Icon
                  className="text-body font-body text-default-font"
                  name="FeatherLock"
                />
                <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
                  API Keys
                </span>
              </div>
              <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
                <SubframeCore.Icon
                  className="text-body font-body text-default-font"
                  name="FeatherCreditCard"
                />
                <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
                  Billing
                </span>
              </div>
              <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
                <SubframeCore.Icon
                  className="text-body font-body text-default-font"
                  name="FeatherShapes"
                />
                <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
                  Integrations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 bg-default-background w-full items-start overflow-auto">
        {children ? (
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch overflow-y-auto">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
});
