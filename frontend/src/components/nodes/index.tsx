import { Button } from "@/subframe/components/Button";

interface NodeLayoutProps {
  children?: React.ReactNode;
  openDrawer: () => void;
}

export function NodeLayout({ children, openDrawer }: NodeLayoutProps) {

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
 
  return (
    <div className="flex w-112 flex-col items-start gap-6 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6">
      {children ? children : null}
      <div className="flex w-full items-center justify-end">
        <div className="nodrag flex w-auto gap-2 pt-2 pr-2 pb-2 pl-2" onClick={stopPropagation}>
          <Button
            variant="brand-secondary"
            icon="FeatherArrowUpRight"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              openDrawer()
            }}
          >
            Open
          </Button>
          <Button onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}>
            Run Node
          </Button>
        </div>
      </div>
    </div>
  );
}

export { default as GenerativeAINode } from "./GenerativeAINode";
export { default as JoinNode } from "./JoinNode";
export { default as MappingNode } from "./MappingNode";
export { default as PythonNode } from "./PythonNode";
export { default as ConditionalNode } from "./ConditionalNode";
export { default as FilterNode } from "./FilterNode";
export { default as SourceNode } from "./SourceNode";
export { default as DestinationNode } from "./DestinationNode";
export { default as SplitNode } from "./SplitNode";
export { default as SQLNode } from "./SQLNode";