"use client";

import React, { useState, useCallback } from "react";
import { 
  Handle, 
  Position,
  type Node,
  type NodeProps,
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

type ConditionalNode = Node<{ openDrawer: () => void }, 'conditional'>;

export default function ConditionalNode({ data }: NodeProps<ConditionalNode>) {
 
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
          Check data freshness
        </span>
        <div className="flex items-center justify-end gap-2">
          <span className="text-body-bold font-body-bold text-default-font">
            Conditional
          </span>
          <IconWithBackground
            variant="brand"
            size="medium"
            icon="FeatherHelpCircle"
            square={false}
          />
        </div>
      </div>
      <span className="text-heading-3 font-heading-3 text-default-font">
        Branches
      </span>
      <div className="flex cursor-default select-text w-full grow shrink-0 basis-0 flex-col items-center gap-2 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default">
        <div className="flex w-full flex-col items-start gap-6">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Branch 1 Conditions
          </span>
          <div className="flex w-full items-start gap-2">
            <Select
              className="h-auto grow shrink-0 basis-0"
              disabled={false}
              error={false}
              variant="outline"
              label=""
              placeholder="Field"
              helpText=""
              icon={null}
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="Item 1">Item 1</Select.Item>
              <Select.Item value="Item 2">Item 2</Select.Item>
              <Select.Item value="Item 3">Item 3</Select.Item>
            </Select>
            <Select
              className="h-auto grow shrink-0 basis-0"
              disabled={false}
              error={false}
              variant="outline"
              label=""
              placeholder="Operation"
              helpText=""
              icon={null}
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="Item 1">Item 1</Select.Item>
              <Select.Item value="Item 2">Item 2</Select.Item>
              <Select.Item value="Item 3">Item 3</Select.Item>
            </Select>
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
          </div>
          <div className="flex w-full items-start gap-2">
            <Select
              className="h-auto grow shrink-0 basis-0"
              disabled={false}
              error={false}
              variant="outline"
              label=""
              placeholder="Field"
              helpText=""
              icon={null}
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="Item 1">Item 1</Select.Item>
              <Select.Item value="Item 2">Item 2</Select.Item>
              <Select.Item value="Item 3">Item 3</Select.Item>
            </Select>
            <Select
              className="h-auto grow shrink-0 basis-0"
              disabled={false}
              error={false}
              variant="outline"
              label=""
              placeholder="Operation"
              helpText=""
              icon={null}
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="Item 1">Item 1</Select.Item>
              <Select.Item value="Item 2">Item 2</Select.Item>
              <Select.Item value="Item 3">Item 3</Select.Item>
            </Select>
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
          </div>
          <div className="flex w-full items-center justify-between">
            <Button
              disabled={false}
              variant="brand-tertiary"
              size="medium"
              icon="FeatherPlus"
              iconRight={null}
              loading={false}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Add Condition
            </Button>
          </div>
        </div>
      </div>
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-center gap-2 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default">
        <div className="flex w-full flex-col items-start gap-6">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Branch 1 Conditions
          </span>
          <div className="flex w-full items-start gap-2">
            <Select
              className="h-auto grow shrink-0 basis-0"
              disabled={false}
              error={false}
              variant="outline"
              label=""
              placeholder="Field"
              helpText=""
              icon={null}
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="Item 1">Item 1</Select.Item>
              <Select.Item value="Item 2">Item 2</Select.Item>
              <Select.Item value="Item 3">Item 3</Select.Item>
            </Select>
            <Select
              className="h-auto grow shrink-0 basis-0"
              disabled={false}
              error={false}
              variant="outline"
              label=""
              placeholder="Operation"
              helpText=""
              icon={null}
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="Item 1">Item 1</Select.Item>
              <Select.Item value="Item 2">Item 2</Select.Item>
              <Select.Item value="Item 3">Item 3</Select.Item>
            </Select>
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
          </div>
          <div className="flex w-full items-start gap-2">
            <Select
              className="h-auto grow shrink-0 basis-0"
              disabled={false}
              error={false}
              variant="outline"
              label=""
              placeholder="Field"
              helpText=""
              icon={null}
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="Item 1">Item 1</Select.Item>
              <Select.Item value="Item 2">Item 2</Select.Item>
              <Select.Item value="Item 3">Item 3</Select.Item>
            </Select>
            <Select
              className="h-auto grow shrink-0 basis-0"
              disabled={false}
              error={false}
              variant="outline"
              label=""
              placeholder="Operation"
              helpText=""
              icon={null}
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="Item 1">Item 1</Select.Item>
              <Select.Item value="Item 2">Item 2</Select.Item>
              <Select.Item value="Item 3">Item 3</Select.Item>
            </Select>
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
          </div>
          <div className="flex w-full items-center justify-between">
            <Button
              disabled={false}
              variant="brand-tertiary"
              size="medium"
              icon="FeatherPlus"
              iconRight={null}
              loading={false}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Add Condition
            </Button>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <Button
          disabled={false}
          variant="brand-tertiary"
          size="medium"
          icon="FeatherPlus"
          iconRight={null}
          loading={false}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
        >
          Add Branch
        </Button>
      </div>
    </NodeLayout>
  );
}