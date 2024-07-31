"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import * as SubframeCore from "@subframe/core";
import { DefaultPageLayout } from "@/subframe/layouts/DefaultPageLayout";
import { IconWithBackground } from "@/subframe/components/IconWithBackground";
import { RadioGroup } from "@/subframe/components/RadioGroup";
import { Button } from "@/subframe/components/Button";
import { Table } from "@/subframe/components/Table";
import { Select } from "@/subframe/components/Select";
import { PropertiesAccordion } from "@/subframe/components/PropertiesAccordion";
import { TextArea } from "@/subframe/components/TextArea";
import { Alert } from "@/subframe/components/Alert";
import { PropertiesRow } from "@/subframe/components/PropertiesRow";
import { Switch } from "@/subframe/components/Switch";

import '@xyflow/react/dist/style.css';

import { Node, NodeType } from "@/types";
import { SourceNode, DestinationNode, MappingNode, JoinNode, SplitNode, FilterNode, ConditionalNode, GenerativeAINode, PythonNode, SQLNode } from "@/components/nodes";

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } , type: 'source' },
  { id: '2', position: { x: 500, y: 0 }, data: { label: '2' }, type:'destination' },
  { id: '3', position: { x: 1000, y: 0 }, data: { label: '3' }, type:'mapping' },
  { id: '4', position: { x: 1500, y: 0 }, data: { label: '4' }, type:'join' },
  { id: '5', position: { x: 2000, y: 0 }, data: { label: '5' }, type:'split' },
  { id: '6', position: { x: 2500, y: 0 }, data: { label: '6' }, type:'filter' },
  { id: '7', position: { x: 3000, y: 0 }, data: { label: '7' }, type:'conditional' },
  { id: '8', position: { x: 3500, y: 0 }, data: { label: '8' }, type:'generative_ai' },
  { id: '9', position: { x: 4000, y: 0 }, data: { label: '9' }, type:'python' },
  { id: '10', position: { x: 4500, y: 0 }, data: { label: '10' }, type:'sql' },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const nodeTypes = {
  source: SourceNode,
  destination: DestinationNode,
  mapping: MappingNode,
  join: JoinNode,
  split: SplitNode,
  filter: FilterNode,
  conditional: ConditionalNode,
  generative_ai: GenerativeAINode,
  python: PythonNode,
  sql: SQLNode,
};

export default function WorkflowPage() {
  // const [nodes] = useState<Node[]>([]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((edges) => addEdge(params, edges)),
    [setEdges],
  )

  function RenderWorkflow() {
    return (
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    );
  }

  function addNode(nodeType: NodeType) {
    console.log('add node');
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: 0, y: 500 },
      data: { label: (nodes.length + 1).toString() },
      type: nodeType,
    };
    setNodes([...nodes, newNode]);
  }

  return (
    <DefaultPageLayout addNode={addNode}>
      <div className="flex h-full w-full flex-col items-start bg-default-background">
        <div className="flex w-full grow shrink-0 basis-0 flex-wrap items-start mobile:flex-col mobile:flex-wrap mobile:gap-0">
          <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-2 self-stretch bg-neutral-50 mobile:border mobile:border-solid mobile:border-neutral-border mobile:pt-12 mobile:pr-12 mobile:pb-12 mobile:pl-12">
            {nodes.length > 0 ? RenderWorkflow() : <div className="flex flex-col items-center justify-center gap-4">
                  <SubframeCore.Icon
                    className="text-heading-3 font-heading-3 text-subtext-color"
                    name="FeatherPlay"
                  />
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-caption-bold font-caption-bold text-default-font">
                    Create your first workflow
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Drag-and-drop a node to start
                  </span>
                </div>
              </div>
            }
          </div>
          <div className="hidden w-80 flex-none flex-col items-start self-stretch border-l border-solid border-neutral-border mobile:h-auto mobile:w-full mobile:flex-none">
            <div className="flex w-full flex-col items-start">
              <PropertiesAccordion title="Source">
                <Select
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
              </PropertiesAccordion>
              <PropertiesAccordion title="Description">
                <TextArea
                  className="h-auto w-full flex-none"
                  variant="filled"
                  label=""
                  helpText=""
                >
                  <TextArea.Input
                    className="h-auto min-h-[96px] w-full flex-none"
                    placeholder="Map Opportunity fields to database fields"
                    value=""
                    onChange={(
                      event: React.ChangeEvent<HTMLTextAreaElement>
                    ) => {}}
                  />
                </TextArea>
              </PropertiesAccordion>
              <PropertiesAccordion title="Privacy">
                <RadioGroup
                  className="h-auto w-full flex-none"
                  label=""
                  helpText=""
                  value=""
                  onValueChange={(value: string) => {}}
                >
                  <RadioGroup.Option label="Public" value="453598a7" />
                  <RadioGroup.Option label="Direct link" value="e9c653e7" />
                  <RadioGroup.Option label="Private" value="66f77842" />
                </RadioGroup>
              </PropertiesAccordion>
              <PropertiesRow text="Timeout">
                <Select
                  variant="filled"
                  label=""
                  placeholder="5 mins"
                  helpText=""
                  value=""
                  onValueChange={(value: string) => {}}
                >
                  <Select.Item value="5 mins">5 mins</Select.Item>
                  <Select.Item value="30 mins">30 mins</Select.Item>
                  <Select.Item value="1 hour">1 hour</Select.Item>
                </Select>
              </PropertiesRow>
              <PropertiesRow text="Monitor web traffic">
                <Switch
                  checked={false}
                  onCheckedChange={(checked: boolean) => {}}
                />
              </PropertiesRow>
              <PropertiesRow text="Enable analytics">
                <Switch
                  checked={false}
                  onCheckedChange={(checked: boolean) => {}}
                />
              </PropertiesRow>
            </div>
            <div className="flex w-full items-center justify-end gap-2 pt-2 pr-2 pb-2 pl-2">
              <Button
                variant="brand-secondary"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              >
                Close
              </Button>
              <Button
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              >
                Run Node
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}