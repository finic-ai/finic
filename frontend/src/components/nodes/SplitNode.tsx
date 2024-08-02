"use client";

import React, { useState, useCallback } from "react";
import { 
  Handle,
  Position,
  type Node,
  type NodeProps
} from '@xyflow/react';
import * as SubframeCore from "@subframe/core";
import { WorkflowPageLayout } from "@/subframe/layouts/WorkflowPageLayout";
import { IconWithBackground } from "@/subframe/components/IconWithBackground";
import { RadioGroup } from "@/subframe/components/RadioGroup";
import { Button } from "@/subframe/components/Button";
import { Table } from "@/subframe/components/Table";
import { Select } from "@/subframe/components/Select";
import { TextField } from "@/subframe/components/TextField";
import { PropertiesAccordion } from "@/subframe/components/PropertiesAccordion";
import { TextArea } from "@/subframe/components/TextArea";
import { Alert } from "@/subframe/components/Alert";
import { PropertiesRow } from "@/subframe/components/PropertiesRow";
import { Switch } from "@/subframe/components/Switch";

import { NodeLayout } from "@/components/nodes";

type SplitNode = Node<{ openDrawer: () => void }, 'split'>;

export default function SplitNode({ data }: NodeProps<SplitNode>) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <NodeLayout openDrawer={data.openDrawer}>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-4 !h-4 !bg-brand-600"
      />
      <Handle 
        type="source" 
        position={Position.Right}
        id="a"
        className="!w-4 !h-4 !bg-brand-600 !top-1/3"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="b"
        className="!w-4 !h-4 !bg-brand-600 !top-2/3"
      />
      <div className="flex w-full items-center justify-center gap-6">
        <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
          Remove Columns
        </span>
        <div className="flex items-center justify-end gap-2">
          <span className="text-body-bold font-body-bold text-default-font">
            Split
          </span>
          <IconWithBackground
            variant="brand"
            size="medium"
            icon="FeatherSplit"
            square={false}
          />
        </div>
      </div>
      <div className="nodrag cursor-default flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default">
        <div className="flex w-full items-center gap-6">
          <div className="flex grow shrink-0 basis-0 flex-col items-center gap-2">
            <div className="flex w-full items-start gap-6">
              <span className="w-24 flex-none text-heading-3 font-heading-3 text-default-font text-center">
                
              </span>
              <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font text-center">
                Output 1
              </span>
              <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font text-center">
                Output 2
              </span>
              <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font text-center">
                Both
              </span>
            </div>
            <div className="flex w-full items-start gap-6">
              <span className="w-24 flex-none text-heading-3 font-heading-3 text-default-font text-center">
                
              </span>
              <span className="grow shrink-0 basis-0 text-body font-body text-brand-700 text-center">
                Deselect All
              </span>
              <span className="grow shrink-0 basis-0 text-body font-body text-brand-700 text-center">
                Select All
              </span>
              <span className="grow shrink-0 basis-0 text-body font-body text-brand-700 text-center">
                Select All
              </span>
            </div>
            <div className="flex w-full flex-col items-center gap-2">
              <div className="flex w-full items-center gap-6">
                <span className="w-24 flex-none text-body font-body text-default-font">
                  opportunity_id
                </span>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-subtext-color">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center gap-6">
                <span className="w-24 flex-none text-body font-body text-default-font">
                  amount
                </span>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center gap-6">
                <span className="w-24 flex-none text-body font-body text-default-font">
                  close_date
                </span>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center gap-6">
                <span className="w-24 flex-none text-body font-body text-default-font">
                  is_clsoed
                </span>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center justify-center">
                  <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background">
                    <SubframeCore.Icon
                      className="hidden text-body font-body text-white"
                      name="FeatherCheck"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="text-body font-body text-subtext-color">
            14 fields hidden
          </span>
          <span className="text-body font-body text-brand-700">Show All</span>
        </div>
      </div>
    </NodeLayout>
  );
}