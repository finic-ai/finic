"use client";

import React, { useState, useCallback } from "react";
import { 
  Handle,
  Position,
  useNodeId,
  type Node,
  type NodeProps
} from '@xyflow/react';
import * as SubframeCore from "@subframe/core";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";
import { Button } from "@/subframe/components/Button";
import { Table } from "@/subframe/components/Table";
import { Select } from "@/subframe/components/Select";
import { TextField } from "@/subframe/components/TextField";
import { PropertiesAccordion } from "@/subframe/components/PropertiesAccordion";
import { TextArea } from "@/subframe/components/TextArea";
import { Alert } from "@/subframe/components/Alert";
import { PropertiesRow } from "@/subframe/components/PropertiesRow";
import { Switch } from "@/subframe/components/Switch";
import { type NodeResults } from "@/types";
import { NodeLayout } from "@/components/Nodes";

type JoinNode = Node<{ 
  title: string, 
  nodeType: string,
  results: NodeResults,
  onNodeOpen: (node_id: string) => void 
}, 'join'>;

export default function JoinNode(props: NodeProps<JoinNode>) {
  const nodeId = useNodeId();

  function onNodeOpen () {
    props.data.onNodeOpen(nodeId as string);
  }
 
  return (
    <NodeLayout openNode={onNodeOpen} title={props.data.title} results={props.data.results} isSelected ={props.selected || false} nodeType={props.type}>
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
      <div className="flex flex-col w-full select-text gap-4">
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
    </NodeLayout>
  );
};

interface JoinNodeConfigurationDrawerProps {
  closeDrawer: () => void;
}

export function JoinNodeConfigurationDrawer() {
  return (
    <div>
      <PropertiesAccordion title="Python Version">
        <Select
          className="h-auto w-full flex-none"
          label=""
          placeholder="python3.10"
          helpText=""
          value=""
          onValueChange={(value: string) => {}}
        >
          <Select.Item value="Item 1">Item 1</Select.Item>
          <Select.Item value="Item 2">Item 2</Select.Item>
          <Select.Item value="Item 3">Item 3</Select.Item>
        </Select>
      </PropertiesAccordion>
      <PropertiesAccordion title="Dependencies">
        <div className="flex flex-col items-start gap-4">
          <span className="text-caption font-caption text-default-font">
            You can specify python packages to import during the execution of this
            workflow. Imported packages will be available across all nodes in this
            workflow.
          </span>
          <div className="flex items-center gap-4">
            <span className="text-caption font-caption text-default-font">
              Package Manager
            </span>
            <ToggleGroup value="" onValueChange={(value: string) => {}}>
              <ToggleGroup.Item icon={null} value="dfe802fe">
                Poetry
              </ToggleGroup.Item>
              <ToggleGroup.Item icon={null} value="69510ce2">
                Pip
              </ToggleGroup.Item>
            </ToggleGroup>
          </div>
          <div className="flex w-full flex-col items-start gap-4 rounded bg-neutral-50 pt-2 pr-2 pb-2 pl-2">
            <span className="w-full whitespace-pre-wrap text-monospace-body font-monospace-body text-default-font">
              {
                'python = ">=3.10,<3.12"\nfastapi = "^0.111.0"\nuvicorn = "^0.20.0"\npython-dotenv = "^0.21.1"\npydantic = "^2.7.1"\nlangchain = "^0.0.317"\nstrenum = "^0.4.15"\nqdrant-client = "^1.3.1"'
              }
            </span>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 pt-4">
          <Button
            variant="neutral-primary"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          >
            Install Packages
          </Button>
        </div>
      </PropertiesAccordion>
      <PropertiesAccordion title="Sample Data">
        <div className="flex flex-col items-start gap-2">
          <Button
            variant="neutral-secondary"
            icon="FeatherUpload"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          >
            Upload
          </Button>
          <span className="text-caption font-caption text-subtext-color">
            Upload a CSV file to test this node with sample  input data.
          </span>
        </div>
      </PropertiesAccordion>
      <PropertiesRow text="Run Schedule">
        <Select
          variant="filled"
          label=""
          placeholder="24 hours"
          helpText=""
          value=""
          onValueChange={(value: string) => {}}
        >
          <Select.Item value="5 mins">5 mins</Select.Item>
          <Select.Item value="30 mins">30 mins</Select.Item>
          <Select.Item value="1 hour">1 hour</Select.Item>
        </Select>
      </PropertiesRow>
      <PropertiesRow text="On Failure">
        <Select
          variant="filled"
          label=""
          placeholder="Retry"
          helpText=""
          value=""
          onValueChange={(value: string) => {}}
        >
          <Select.Item value="5 mins">5 mins</Select.Item>
          <Select.Item value="Notify">Notify</Select.Item>
          <Select.Item value="Ignore">Ignore</Select.Item>
        </Select>
      </PropertiesRow>
    </div>
  )
};