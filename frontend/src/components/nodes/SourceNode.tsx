"use client";

import React, { useState, useCallback } from "react";
import {
  Handle,
  Position,
  useNodeId,
  useStoreApi,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import * as SubframeCore from "@subframe/core";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";
import { Button } from "@/subframe/components/Button";
import { Table } from "@/subframe/components/Table";
import { Select } from "@/subframe/components/Select";
import { PropertiesAccordion } from "@/subframe/components/PropertiesAccordion";
import { TextArea } from "@/subframe/components/TextArea";
import { Alert } from "@/subframe/components/Alert";
import { PropertiesRow } from "@/subframe/components/PropertiesRow";
import { Switch } from "@/subframe/components/Switch";
import { type NodeResults, SourceConfigurationDrawerType } from "@/types/index";
import { NodeLayout } from "@/components/Nodes/index";

type SourceNode = Node<
  {
    title: string;
    nodeType: string;
    results: NodeResults;
    onNodeOpen: (node_id: string) => void;
  },
  "source"
>;

export default function SourceNode(props: NodeProps<SourceNode>) {
  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <NodeLayout
      nodeId={props.id}
      title={props.data.title}
      results={props.data.results}
      isSelected={props.selected || false}
      nodeType={props.type}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-brand-600"
      />
      <span className="text-body-bold font-body-bold text-default-font">
        Source: FiveTran
      </span>
      <div className="flex flex-col w-full select-text gap-4">
        <span className="text-heading-3 font-heading-3 text-default-font">
          Schema
        </span>
        <div className="flex w-full flex-col items-start gap-4 rounded bg-neutral-50 pt-2 pr-2 pb-2 pl-2">
          <span className="w-full whitespace-pre-wrap text-monospace-body font-monospace-body text-default-font">
            {
              '{\n  "opportunity_id": "string",\n  "amount": "currency",\n  "close_date": "datetime",\n  "expected_revenue": "currency",\n  "fiscal": "string",\n  "is_closed": "boolean",\n  "is_win": "boolean"\n}'
            }
          </span>
        </div>
      </div>
    </NodeLayout>
  );
}

interface SourceNodeConfigurationDrawerProps {
  nodeData?: any;
}

export function SourceNodeConfigurationDrawer({ nodeData }: SourceNodeConfigurationDrawerProps) {
  return (
    React.createElement(
      SourceConfigurationDrawerType[nodeData.sourceType as keyof typeof SourceConfigurationDrawerType] as React.ElementType,
    )
  );
}