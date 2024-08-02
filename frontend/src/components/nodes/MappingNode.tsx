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

type MappingNode = Node<{ openDrawer: () => void }, 'mapping'>;

export default function MappingNode({ data }: NodeProps<MappingNode>) {
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
      className="!w-4 !h-4 !bg-brand-600"
    />
    <div className="flex w-full items-center justify-center gap-6">
      <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
        Rename Fields
      </span>
      <div className="flex items-center justify-end gap-2">
        <span className="text-body-bold font-body-bold text-default-font">
          Mapping
        </span>
        <IconWithBackground
          variant="brand"
          size="medium"
          icon="FeatherFileJson"
          square={false}
        />
      </div>
    </div>
    <div className="nodrag cursor-default select-text flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default">
      <span className="text-heading-3 font-heading-3 text-default-font">
        Column Mappings
      </span>
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full items-center justify-center gap-2">
          <Select
            className="h-auto grow shrink-0 basis-0"
            disabled={false}
            error={false}
            variant="outline"
            label=""
            placeholder="Select"
            helpText=""
            icon={null}
            value=""
            onValueChange={(value: string) => {}}
          >
            <Select.Item value="Item 1">Item 1</Select.Item>
            <Select.Item value="Item 2">Item 2</Select.Item>
            <Select.Item value="Item 3">Item 3</Select.Item>
          </Select>
          <div className="flex h-px w-16 flex-none flex-col items-center gap-2 bg-neutral-200" />
          <TextField
            className="h-auto grow shrink-0 basis-0"
            disabled={false}
            error={false}
            variant="outline"
            label=""
            helpText=""
            icon={null}
            iconRight={null}
          >
            <TextField.Input
              placeholder=""
              value=""
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
            />
          </TextField>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <Select
            className="h-auto grow shrink-0 basis-0"
            disabled={false}
            error={false}
            variant="outline"
            label=""
            placeholder="Select"
            helpText=""
            icon={null}
            value=""
            onValueChange={(value: string) => {}}
          >
            <Select.Item value="Item 1">Item 1</Select.Item>
            <Select.Item value="Item 2">Item 2</Select.Item>
            <Select.Item value="Item 3">Item 3</Select.Item>
          </Select>
          <div className="flex h-px w-16 flex-none flex-col items-center gap-2 bg-neutral-200" />
          <TextField
            className="h-auto grow shrink-0 basis-0"
            disabled={false}
            error={false}
            variant="outline"
            label=""
            helpText=""
            icon={null}
            iconRight={null}
          >
            <TextField.Input
              placeholder=""
              value=""
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
            />
          </TextField>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <Select
            className="h-auto grow shrink-0 basis-0"
            disabled={false}
            error={false}
            variant="outline"
            label=""
            placeholder="Select"
            helpText=""
            icon={null}
            value=""
            onValueChange={(value: string) => {}}
          >
            <Select.Item value="Item 1">Item 1</Select.Item>
            <Select.Item value="Item 2">Item 2</Select.Item>
            <Select.Item value="Item 3">Item 3</Select.Item>
          </Select>
          <div className="flex h-px w-16 flex-none flex-col items-center gap-2 bg-neutral-200" />
          <TextField
            className="h-auto grow shrink-0 basis-0"
            disabled={false}
            error={false}
            variant="outline"
            label=""
            helpText=""
            icon={null}
            iconRight={null}
          >
            <TextField.Input
              placeholder=""
              value=""
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
            />
          </TextField>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <Select
            className="h-auto grow shrink-0 basis-0"
            disabled={false}
            error={false}
            variant="outline"
            label=""
            placeholder="Select"
            helpText=""
            icon={null}
            value=""
            onValueChange={(value: string) => {}}
          >
            <Select.Item value="Item 1">Item 1</Select.Item>
            <Select.Item value="Item 2">Item 2</Select.Item>
            <Select.Item value="Item 3">Item 3</Select.Item>
          </Select>
          <div className="flex h-px w-16 flex-none flex-col items-center gap-2 bg-neutral-200" />
          <TextField
            className="h-auto grow shrink-0 basis-0"
            disabled={false}
            error={false}
            variant="outline"
            label=""
            helpText=""
            icon={null}
            iconRight={null}
          >
            <TextField.Input
              placeholder=""
              value=""
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
            />
          </TextField>
        </div>
      </div>
      <div className="flex flex-col items-start gap-1">
        <span className="text-body font-body text-subtext-color">
          14 columns hidden
        </span>
        <span className="text-body font-body text-brand-700">Show All</span>
      </div>
    </div>
  </NodeLayout>
  );
}