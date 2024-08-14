import { useState, useEffect, useCallback } from "react";
import { useStoreApi, type Node, type Edge, type NodeTypes } from "@xyflow/react";
import { useAuth } from "@/hooks/useAuth";

interface Workflow {
  id: string;
  app_id: string;
  name: string;
  nodes: Array<Node>;
  edges: Array<Edge>;
}

export default function useNode() {
  const store = useStoreApi();

  const openNode = useCallback((node: Node, config: any) => {    
    const { addSelectedNodes } = store.getState();
    addSelectedNodes([node.id]);
  }, [store]);

  return {
    openNode
  };
}