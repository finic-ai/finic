"use client";

import React, { useState, useRef } from "react";
import {
  Handle,
  Position,
  useNodeId,
  useStoreApi,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { Badge } from "@/subframe/components/Badge";
import { type NodeResults, SourceConfigurationDrawerType } from "@/types/index";
import { NodeLayout } from "@/components/Nodes/index";
import { SourceTypeNames, SourceConfigFields } from "@/types/index";
import { IconName } from "@/subframe/components/IconWithBackground";

type SourceNode = Node<
  {
    name: string;
    configuration: any;
    results?: NodeResults;
  },
  "source"
>;

export default function SourceNode(props: NodeProps<SourceNode>) {
  const isConfigured = props.data.configuration ? true : false;
  const sourceType = props.data.configuration?.sourceType ?? null;
  const sourceConfigNames = SourceConfigFields[sourceType as keyof typeof SourceConfigFields];

  function renderUnconfiguredNode() {
    return (
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 rounded border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-default">
        <span className="w-full text-body font-body text-default-font text-center">
          Click on this node or the &quot;Open&quot; button to configure it.
        </span>
      </div>
    )
  }

  function renderConfiguredNode() {
    return (
      <div className="flex w-full flex-col justify-center gap-2">
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 rounded border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-default">
          <div className="flex items-center gap-2">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Source: 
            </span>
            <span className="text-body-bold font-body-bold text-default-font">
              {SourceTypeNames[sourceType as keyof typeof SourceTypeNames]}
            </span>
          </div>
        </div>
        {Object.keys(sourceConfigNames).map((key) => {
          return (
            <div key={key} className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 rounded border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-default">
              <div className="flex items-center gap-2">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  {sourceConfigNames[key]}:
                </span>
                <span className="text-body-bold font-body-bold text-default-font">
                  {props.data.configuration[key]}
                </span>
              </div>
            </div>
          );
        })}
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 rounded border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-default">
          <div className="flex items-center gap-2">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Credentials: 
            </span>
            <Badge variant={isConfigured ? "success" : "error"} icon={isConfigured ? "FeatherCheckCircle" : "FeatherAlertTriangle"}>
              {isConfigured ? "Connected" : "Missing"}
            </Badge>
          </div>
        </div>
      </div>
    )
  }


  return (
    <NodeLayout
      nodeId={props.id}
      nodeName={props.data.name}
      results={props.data.results}
      isSelected={props.selected || false}
      nodeType={props.type}
    >
      {isConfigured ? <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-brand-600"
      /> : null}
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-end justify-center gap-2">
          <Badge
            className="p-4 text-heading-3"
            variant={isConfigured ? "success" : "brand"} 
            icon={isConfigured? "FeatherCheckCircle" as IconName : "FeatherAlertTriangle" as IconName}
          >
            {isConfigured ? "Ready to Run" : "Not Configured"}
          </Badge>
        </div>
        {isConfigured ? renderConfiguredNode() : renderUnconfiguredNode()}
      </div>
    </NodeLayout>
  );
}