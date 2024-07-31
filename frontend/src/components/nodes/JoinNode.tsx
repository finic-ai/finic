"use client";

import React, { useState, useCallback } from "react";
import { Handle, Position } from '@xyflow/react';
import * as SubframeCore from "@subframe/core";
import { DefaultPageLayout } from "@/subframe/layouts/DefaultPageLayout";
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

import { Node, NodeType } from "@/types";

export default function JoinNode() {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <div className="flex w-112 flex-col items-start gap-6 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6">
      <Handle 
        type="target" 
        position={Position.Left} 
        id="a"
        className="!w-4 !h-4 !bg-brand-600 !top-1/3"
      />
      <Handle 
        type="target" 
        position={Position.Left}
        id="b"
        className="!w-4 !h-4 !bg-brand-600 !top-2/3"
      />
      <Handle 
        type="source" 
        position={Position.Right}
        className="!w-4 !h-4 !bg-brand-600"
      />
      <div className="flex w-full items-center justify-center gap-6">
        <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
          Join Salesforce and Hubspot
        </span>
        <div className="flex items-center justify-end gap-2">
          <span className="text-body-bold font-body-bold text-default-font">
            Join
          </span>
          <IconWithBackground
            variant="brand"
            size="medium"
            icon="FeatherMerge"
            square={false}
          />
        </div>
      </div>
      <div className="nodrag cursor-default select-text flex w-full grow shrink-0 basis-0 flex-col items-center gap-2 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default">
        <div className="flex w-full flex-col items-start gap-6">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Columns to Join On
          </span>
          <div className="flex w-full items-start gap-6">
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
              <Select
                className="h-auto w-full flex-none"
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
              <Select
                className="h-auto w-full flex-none"
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
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
              <Select
                className="h-auto w-full flex-none"
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
              <Select
                className="h-auto w-full flex-none"
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
              Add Column
            </Button>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-2 pt-2 pr-2 pb-2 pl-2">
        <Button
          variant="brand-secondary"
          icon="FeatherArrowUpRight"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
        >
          Open
        </Button>
        <Button onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}>
          Run Node
        </Button>
      </div>
    </div>
  );
}