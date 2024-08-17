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
import { PropertiesAccordion } from "@/subframe/components/PropertiesAccordion";
import { TextArea } from "@/subframe/components/TextArea";
import { Alert } from "@/subframe/components/Alert";
import { PropertiesRow } from "@/subframe/components/PropertiesRow";
import { Switch } from "@/subframe/components/Switch";
import { type NodeResults } from "@/types/index";
import { NodeLayout } from "@/components/Nodes/index";

type DestinationNode = Node<
  {
    name: string;
    nodeType: string;
    results?: NodeResults;
  },
  "destination"
>;

export default function DestinationNode(props: NodeProps<DestinationNode>) {
  return (
    <NodeLayout
      nodeId={props.id}
      nodeName={props.data.name}
      results={props.data.results}
      isSelected={props.selected || false}
      nodeType={props.type}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-brand-600"
      />
      <div className="flex flex-col w-full select-text gap-4">
        <span className="text-body-bold font-body-bold text-default-font">
          Destination: BigQuery
        </span>
        <span className="text-heading-3 font-heading-3 text-default-font">
          Database
        </span>
        <div className="flex w-full flex-col items-start gap-4 rounded bg-neutral-50 pt-2 pr-2 pb-2 pl-2">
          <span className="w-full whitespace-pre-wrap break-words text-monospace-body font-monospace-body text-default-font nodrag">
            {"xyz_company.customer_data.customer1234_salesforce"}
          </span>
        </div>
      </div>
    </NodeLayout>
  );
}
