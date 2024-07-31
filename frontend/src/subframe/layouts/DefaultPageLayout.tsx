"use client";

import React from "react";
import * as SubframeCore from "@subframe/core";
import { EditorTopBar } from "../components/EditorTopBar";
import { SidebarTile } from "../components/SidebarTile";
import { SidebarButton } from "../components/SidebarButton";

import { NodeType } from "@/types";

interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  addNode: (nodeType: NodeType) => void;
}

const DefaultPageLayoutRoot = React.forwardRef<
  HTMLElement,
  DefaultPageLayoutRootProps
>(function DefaultPageLayoutRoot(
  { children, className, addNode, ...otherProps }: DefaultPageLayoutRootProps,
  ref
) {
  return (
    <div className="flex flex-col h-screen bg-default-background">
      <EditorTopBar className="flex-none"/>
      <div className="flex flex-1 bg-default-background w-full items-start overflow-hidden">
        <div className="flex w-32 flex-col items-start justify-between border-r border-solid border-neutral-border h-full">
          <div className="flex flex-1 w-full overflow-auto flex-col items-start gap-px border-b border-solid border-neutral-border bg-neutral-border">
            <div className="flex w-full flex-col items-center gap-px bg-default-background pt-2 pr-2 pb-2 pl-2">
              <span className="text-heading-3 font-heading-3 text-default-font">
                Nodes
              </span>
            </div>
            <SubframeCore.HoverCard.Root>
              <SubframeCore.HoverCard.Trigger asChild={true}>
                <SidebarTile className="flex-grow min-h-16" icon="FeatherFileInput" text="Source" onClick={() => addNode('source')}/>
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
                <SidebarTile className="flex-grow min-h-16" icon="FeatherFileOutput" text="Destination" onClick={() => addNode('destination')}/>
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
                <SidebarTile className="flex-grow min-h-16" icon="FeatherFileJson" text="Mapping" onClick={() => addNode('mapping')}/>
              </SubframeCore.HoverCard.Trigger>
              <SubframeCore.HoverCard.Portal>
                <SubframeCore.HoverCard.Content
                  side="right"
                  align="center"
                  sideOffset={4}
                  asChild={true}
                >
                  <div className="flex w-32 flex-none flex-col items-start justify-center gap-1 rounded border border-solid border-neutral-border bg-default-background pt-3 pr-3 pb-3 pl-3 shadow-overlay">
                    <span className="text-caption font-caption text-default-font">
                      Change the names of fields in a node&#39;s output.
                    </span>
                  </div>
                </SubframeCore.HoverCard.Content>
              </SubframeCore.HoverCard.Portal>
            </SubframeCore.HoverCard.Root>
            <SubframeCore.HoverCard.Root>
              <SubframeCore.HoverCard.Trigger asChild={true}>
                <SidebarTile className="flex-grow min-h-16" icon="FeatherMerge" text="Join" onClick={() => addNode('join')}/>
              </SubframeCore.HoverCard.Trigger>
              <SubframeCore.HoverCard.Portal>
                <SubframeCore.HoverCard.Content
                  side="right"
                  align="center"
                  sideOffset={4}
                  asChild={true}
                >
                  <div className="flex w-32 flex-none flex-col items-end gap-1 rounded border border-solid border-neutral-border bg-default-background pt-3 pr-3 pb-3 pl-3 shadow-overlay">
                    <span className="text-caption font-caption text-default-font">
                      Combine the output of two nodes, merging rows based the
                      values in one or more fields.
                    </span>
                  </div>
                </SubframeCore.HoverCard.Content>
              </SubframeCore.HoverCard.Portal>
            </SubframeCore.HoverCard.Root>
            <SubframeCore.HoverCard.Root>
              <SubframeCore.HoverCard.Trigger asChild={true}>
                <SidebarTile className="flex-grow min-h-16" icon="FeatherSplit" text="Split" onClick={() => addNode('split')}/>
              </SubframeCore.HoverCard.Trigger>
              <SubframeCore.HoverCard.Portal>
                <SubframeCore.HoverCard.Content
                  side="right"
                  align="center"
                  sideOffset={4}
                  asChild={true}
                >
                  <div className="flex w-32 flex-none flex-col items-end justify-center gap-1 rounded border border-solid border-neutral-border bg-default-background pt-3 pr-3 pb-3 pl-3 shadow-overlay">
                    <span className="text-caption font-caption text-default-font">
                      Split the output of a node in two, choosing which fields
                      will be kept in each output.
                    </span>
                  </div>
                </SubframeCore.HoverCard.Content>
              </SubframeCore.HoverCard.Portal>
            </SubframeCore.HoverCard.Root>
            <SubframeCore.HoverCard.Root>
              <SubframeCore.HoverCard.Trigger asChild={true}>
                <SidebarTile className="flex-grow min-h-16" icon="FeatherFilter" text="Filter" onClick={() => addNode('filter')}/>
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
                      Remove rows from a node&#39;s output based on filter
                      criteria.
                    </span>
                  </div>
                </SubframeCore.HoverCard.Content>
              </SubframeCore.HoverCard.Portal>
            </SubframeCore.HoverCard.Root>
            <SubframeCore.HoverCard.Root>
              <SubframeCore.HoverCard.Trigger asChild={true}>
                <SidebarTile className="flex-grow min-h-16" icon="FeatherHelpCircle" text="Conditional" onClick={() => addNode('conditional')}/>
              </SubframeCore.HoverCard.Trigger>
              <SubframeCore.HoverCard.Portal>
                <SubframeCore.HoverCard.Content
                  side="right"
                  align="center"
                  sideOffset={4}
                  asChild={true}
                >
                  <div className="flex w-32 flex-none flex-col items-end justify-end gap-1 rounded border border-solid border-neutral-border bg-default-background pt-3 pr-3 pb-3 pl-3 shadow-overlay">
                    <span className="text-caption font-caption text-default-font">
                      Branch a workflow into multiple paths based on a boolean
                      condition.
                    </span>
                  </div>
                </SubframeCore.HoverCard.Content>
              </SubframeCore.HoverCard.Portal>
            </SubframeCore.HoverCard.Root>
            <SubframeCore.HoverCard.Root>
              <SubframeCore.HoverCard.Trigger asChild={true}>
                <SidebarTile className="flex-grow min-h-16" icon="FeatherSparkles" text="Generative AI" onClick={() => addNode('generative_ai')}/>
              </SubframeCore.HoverCard.Trigger>
              <SubframeCore.HoverCard.Portal>
                <SubframeCore.HoverCard.Content
                  side="right"
                  align="center"
                  sideOffset={4}
                  asChild={true}
                >
                  <div className="flex w-32 flex-none flex-col items-start justify-center gap-1 rounded border border-solid border-neutral-border bg-default-background pt-3 pr-3 pb-3 pl-3 shadow-overlay">
                    <span className="text-caption font-caption text-default-font">
                      Send the output of a Node to a LLM for processing.
                    </span>
                  </div>
                </SubframeCore.HoverCard.Content>
              </SubframeCore.HoverCard.Portal>
            </SubframeCore.HoverCard.Root>
            <SubframeCore.HoverCard.Root>
              <SubframeCore.HoverCard.Trigger asChild={true}>
                <SidebarTile className="flex-grow min-h-16" icon="FeatherCode2" text="Python" onClick={() => addNode('python')}/>
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
            <SubframeCore.HoverCard.Root>
              <SubframeCore.HoverCard.Trigger asChild={true}>
                <SidebarTile className="flex-grow min-h-16" icon="FeatherDatabaseZap" text="SQL" onClick={() => addNode('sql')}/>
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
                      Query the output of a node as if it were a SQL table.
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
});

export const DefaultPageLayout = DefaultPageLayoutRoot;