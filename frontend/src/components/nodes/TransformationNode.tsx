"use client";

import React, { useState, useCallback } from "react";
import {
  Handle,
  Position,
  useNodeId,
  type Node,
  type NodeProps,
} from "@xyflow/react";
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
import { type NodeResults } from "@/types/index";
import { NodeLayout } from "@/components/Nodes/index";
import { ConfigurationDrawer } from "../ConfigurationDrawer";

type TransformationNode = Node<
  {
    title: string;
    nodeType: string;
    results: NodeResults;
  },
  "transformation"
>;

export default function TransformationNode(props: NodeProps<TransformationNode>) {
  return (
    <NodeLayout
      nodeId={props.id}
      title={props.data.title}
      results={props.data.results}
      isSelected={props.selected || false}
      nodeType={props.type}
    >
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
      <div className="flex flex-col w-full select-text gap-4">
        <span className="text-heading-3 font-heading-3 text-default-font">
          Code
        </span>
        <div className="flex w-full flex-col items-start gap-4 rounded bg-neutral-50 pt-2 pr-2 pb-2 pl-2">
          <span className="w-full whitespace-pre-wrap text-monospace-body font-monospace-body text-default-font">
            {"// Add a bit of code here\n\n// And some more if needed..."}
          </span>
        </div>
      </div>
    </NodeLayout>
  );
}

interface TransformationNodeConfigurationDrawerProps {
  nodeData?: any;
}

export function TransformationNodeConfigurationDrawer({ }: TransformationNodeConfigurationDrawerProps) {
  return (
    <div>
      <PropertiesAccordion title="Description">
        <TextArea
          className="h-auto w-full flex-none"
          variant="filled"
          label=""
          helpText=""
        >
          <TextArea.Input
            className="h-auto min-h-[96px] w-full flex-none"
            placeholder="Receive data from FiveTran's Salesforce connector"
            value=""
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {}}
          />
        </TextArea>
      </PropertiesAccordion>
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
      <PropertiesAccordion title="Run Schedule">
        <div className="flex flex-col items-start gap-4">
          <span className="text-caption font-caption text-default-font">
            By default, a node will immediately run after all its input nodes have
            completed running. Setting a schedule delays running until the specified
            time.
          </span>
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-caption-bold font-caption-bold text-default-font">
              Enable Schedule
            </span>
            <Switch checked={false} onCheckedChange={(checked: boolean) => {}} />
          </div>
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              className="h-8 grow shrink-0 basis-0"
              variant="neutral-secondary"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Crontab
            </Button>
            <Button
              className="h-8 grow shrink-0 basis-0"
              icon="FeatherCheck"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Basic
            </Button>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-caption-bold font-caption-bold text-default-font">
              Run Frequency
            </span>
            <Select
              variant="filled"
              label=""
              placeholder="Weekly"
              helpText=""
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="5 mins">5 mins</Select.Item>
              <Select.Item value="30 mins">30 mins</Select.Item>
              <Select.Item value="1 hour">1 hour</Select.Item>
            </Select>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-caption-bold font-caption-bold text-default-font">
              Day of Week
            </span>
            <Select
              variant="filled"
              label=""
              placeholder="Thursday"
              helpText=""
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="5 mins">5 mins</Select.Item>
              <Select.Item value="30 mins">30 mins</Select.Item>
              <Select.Item value="1 hour">1 hour</Select.Item>
            </Select>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-caption-bold font-caption-bold text-default-font">
              Hour of Day
            </span>
            <Select
              variant="filled"
              label=""
              placeholder="12:00:00 UTC"
              helpText=""
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="5 mins">5 mins</Select.Item>
              <Select.Item value="30 mins">30 mins</Select.Item>
              <Select.Item value="1 hour">1 hour</Select.Item>
            </Select>
          </div>
        </div>
      </PropertiesAccordion>
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
  );
}
