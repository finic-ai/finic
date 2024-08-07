import React, { useRef, useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import "../App.css";

import posthog from "posthog-js";
import { useUserStateContext } from "../context/UserStateContext";
import { DefaultPageLayout } from "../subframe";
import {
  Background,
  ReactFlow,
  SelectionMode,
  MiniMap,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import SourceNode from "./sourceNode";

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});

const initialNodes = [
  {
    id: "1",
    data: { value: 123 },
    position: { x: 0, y: 0 },
    type: "sourceNode",
  },
  {
    id: "2",
    data: { label: "World" },
    position: { x: 100, y: 100 },
  },
];

const nodeTypes = { sourceNode: SourceNode };

function WorkflowGraph() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState<any>([]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    []
  );

  return (
    <div className="relative bg-gray-50 w-full h-full">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={{
          account: "paid-pro",
          hideAttribution: true,
        }}
        fitView
        panOnScroll
        selectionOnDrag
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

function Workflows() {
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState<boolean>(false);

  const [uploaded, setUploaded] = useState<boolean>(false);
  // formCompletion is a state but of function type
  const [generating, setGenerating] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { bearer, email, userId, firstName } = useUserStateContext();

  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full flex-col items-start gap-4 bg-default-background">
        <WorkflowGraph />
      </div>
    </DefaultPageLayout>
  );
}

export default Workflows;
