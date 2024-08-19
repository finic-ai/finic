"use client";

import React from "react";
import { ReactFlowProvider, type NodeTypes } from "@xyflow/react";
import * as SubframeCore from "@subframe/core";
import { EditorTopBar } from "@/components/TopBar";
import { SidebarTile } from "@/subframe/components/SidebarTile";
import { SidebarButton } from "@/subframe/components/SidebarButton";
import { FinicNodeType } from "@/types/index";
import { useParams } from "react-router-dom";
import { useUserStateContext } from "@/hooks/useAuth";

interface WorkflowPageLayoutProps {
  children?: React.ReactNode;
  addNode: (type: FinicNodeType) => void;
  deleteWorkflow: () => void;
  workflowRunLoading: boolean;
  runWorkflow: () => void;
}

export function WorkflowPageLayout({
  children,
  addNode,
  deleteWorkflow,
  workflowRunLoading,
  runWorkflow,
}: WorkflowPageLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-default-background">
      <EditorTopBar
        className="flex-none"
        deleteWorkflow={deleteWorkflow}
        workflowRunLoading={workflowRunLoading}
        runWorkflow={runWorkflow}
      />
      <div className="flex flex-1 bg-default-background w-full items-start overflow-auto">
        <div className="flex w-32 flex-col items-start justify-between border-r border-solid border-neutral-border h-full">
          <div className="flex flex-1 w-full overflow-auto flex-col items-start gap-px border-b border-solid border-neutral-border bg-neutral-border">
            <div className="flex w-full flex-col items-center gap-px bg-default-background pt-2 pr-2 pb-2 pl-2">
              <span className="text-heading-3 font-heading-3 text-default-font">
                Nodes
              </span>
            </div>
            <SubframeCore.HoverCard.Root>
              <SubframeCore.HoverCard.Trigger asChild={true}>
                <SidebarTile
                  className="flex-grow min-h-16"
                  icon="FeatherFileInput"
                  text="Source"
                  onClick={() => addNode(FinicNodeType.SOURCE)}
                />
              </SubframeCore.HoverCard.Trigger>
              <SubframeCore.HoverCard.Portal>
                <SubframeCore.HoverCard.Content
                  side="right"
                  align="center"
                  sideOffset={4}
                  asChild={true}
                >
                  <div className="flex w-32 flex-none flex-col items-start gap-1 rounded border border-solid border-neutral-border bg-default-background pt-3 pr-3 pb-3 pl-3 shadow-overlay">
                    <span className="text-caption font-caption text-default-font">
                      Receive data from an API or one of our pre-built
                      connectors.
                    </span>
                  </div>
                </SubframeCore.HoverCard.Content>
              </SubframeCore.HoverCard.Portal>
            </SubframeCore.HoverCard.Root>
            <SubframeCore.HoverCard.Root>
              <SubframeCore.HoverCard.Trigger asChild={true}>
                <SidebarTile
                  className="flex-grow min-h-16"
                  icon="FeatherFileOutput"
                  text="Destination"
                  onClick={() => addNode(FinicNodeType.DESTINATION)}
                />
              </SubframeCore.HoverCard.Trigger>
              <SubframeCore.HoverCard.Portal>
                <SubframeCore.HoverCard.Content
                  side="right"
                  align="center"
                  sideOffset={4}
                  asChild={true}
                >
                  <div className="flex w-32 flex-none flex-col items-start gap-1 rounded border border-solid border-neutral-border bg-default-background pt-3 pr-3 pb-3 pl-3 shadow-overlay">
                    <span className="text-caption font-caption text-default-font">
                      Send the final result of a workflow to an API endpoint or
                      database,
                    </span>
                  </div>
                </SubframeCore.HoverCard.Content>
              </SubframeCore.HoverCard.Portal>
            </SubframeCore.HoverCard.Root>
            <SubframeCore.HoverCard.Root>
              <SubframeCore.HoverCard.Trigger asChild={true}>
                <SidebarTile
                  className="flex-grow min-h-16"
                  icon="FeatherCode2"
                  text="Transformation"
                  onClick={() => addNode(FinicNodeType.TRANSFORMATION)}
                />
              </SubframeCore.HoverCard.Trigger>
              <SubframeCore.HoverCard.Portal>
                <SubframeCore.HoverCard.Content
                  side="right"
                  align="center"
                  sideOffset={4}
                  asChild={true}
                >
                  <div className="flex w-32 flex-none flex-col items-start justify-end gap-1 rounded border border-solid border-neutral-border bg-default-background pt-3 pr-3 pb-3 pl-3 shadow-overlay">
                    <span className="text-caption font-caption text-default-font">
                      Define a python function to transform the output of a
                      node.
                    </span>
                  </div>
                </SubframeCore.HoverCard.Content>
              </SubframeCore.HoverCard.Portal>
            </SubframeCore.HoverCard.Root>
          </div>
          <div className="flex w-full flex-col items-start justify-end">
            <SidebarButton icon="FeatherSettings" text="Settings" />
            <SidebarButton icon="FeatherHelpCircle" text="Help" />
          </div>
        </div>
        {children ? (
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch overflow-y-auto">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
