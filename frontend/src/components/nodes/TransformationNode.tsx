"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Handle,
  Position,
  useNodeId,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import CodeMirror from "@uiw/react-codemirror";
import { Button } from "@/subframe/components/Button";
import { type NodeResults } from "@/types/index";
import { NodeLayout } from "@/components/Nodes/index";
import { python } from "@codemirror/lang-python";
import useWorkflow from "@/hooks/useWorkflow";
import { useUserStateContext } from "@/hooks/useAuth";

type TransformationNode = Node<
  {
    name: string;
    configuration?: {
      code: string;
      dependencies: string[];
    };
    results: NodeResults;
  },
  "transformation"
>;

export default function TransformationNode(
  props: NodeProps<TransformationNode>
) {
  const nodeId = useNodeId();
  const {
    updateTransformationNodeCode,
    getTransformationNodeCode,
    workflowId,
  } = useWorkflow();
  const { bearer } = useUserStateContext();
  const [code, setCode] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (bearer && nodeId && workflowId) {
      getTransformationNodeCode(bearer, nodeId).then((data) => {
        setCode(data.code || "");
      });
    }
  }, [bearer, nodeId]);

  function onClickSave(event: React.MouseEvent<HTMLButtonElement>) {
    if (bearer && nodeId) {
      updateTransformationNodeCode(bearer, nodeId, code);
    }
  }

  return (
    <NodeLayout
      nodeClassName="!w-144"
      resultsClassName="!w-144"
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
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        className="!w-4 !h-4 !bg-brand-600"
      />
      <div className="flex flex-col w-full select-text gap-4">
        <div className="flex w-full flex-col items-start gap-4 rounded bg-neutral-50 pt-2 pr-2 pb-2 pl-2">
          <CodeMirror
            style={{ height: "300px", width: "100%" }}
            height="300px"
            value={code}
            extensions={[python()]}
            onChange={(code) => setCode(code)}
          />
          <Button onClick={onClickSave}>Save</Button>
        </div>
      </div>
    </NodeLayout>
  );
}
