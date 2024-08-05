import * as SubframeCore from "@subframe/core";
import { Button } from "@/subframe/components/Button";
import { IconWithBackground} from "@/subframe/components/IconWithBackground";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { nodeTypes, NodeTypeNames, NodeIcons } from "@/types";

interface NodeLayoutProps {
  children?: React.ReactNode;
  title: string;
  nodeType: string;
  openNode: () => void;
}

export function NodeLayout({ children, title, nodeType, openNode }: NodeLayoutProps) {

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
 
  return (
    <div className="flex w-112 flex-col items-start gap-6 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <IconWithBackground
              variant="brand"
              size="medium"
              icon={NodeIcons[nodeType as keyof SubframeCore.IconName]}
              square={false}
            />
            <span className="text-body-bold font-body-bold text-default-font">
              {NodeTypeNames[nodeType as keyof typeof NodeTypeNames]}
            </span>
            </div>
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Button
                  disabled={false}
                  variant="neutral-secondary"
                  size="medium"
                  icon="FeatherMoreVertical"
                  iconRight={null}
                  loading={false}
                  onClick={stopPropagation}
                />
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu>
                    <DropdownMenu.DropdownItem icon="FeatherCopy" onClick={stopPropagation}>
                      Duplicate
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherTrash" onClick={stopPropagation}>
                      Delete
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
        </div>
        <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
          {title}
        </span>
      </div>
      <div 
        className="nodrag cursor-default flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default"
        onClick={stopPropagation}
      >
        {children ? children : null}
      </div>
      <div className="flex w-full items-center justify-end">
        <div className="nodrag flex w-auto gap-2 pt-2 pr-2 pb-2 pl-2" onClick={stopPropagation}>
          <Button
            variant="brand-secondary"
            icon="FeatherArrowUpRight"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              openNode()
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

export { default as GenerativeAINode, GenerativeAINodeConfigurationDrawer } from "./GenerativeAINode";
export { default as JoinNode, JoinNodeConfigurationDrawer } from "./JoinNode";
export { default as MappingNode, MappingNodeConfigurationDrawer } from "./MappingNode";
export { default as PythonNode, PythonNodeConfigurationDrawer } from "./PythonNode";
export { default as ConditionalNode, ConditionalNodeConfigurationDrawer } from "./ConditionalNode";
export { default as FilterNode, FilterNodeConfigurationDrawer } from "./FilterNode";
export { default as SourceNode, SourceNodeConfigurationDrawer } from "./SourceNode";
export { default as DestinationNode, DestinationNodeConfigurationDrawer } from "./DestinationNode";
export { default as SplitNode, SplitNodeConfigurationDrawer } from "./SplitNode";
export { default as SQLNode, SQLNodeConfigurationDrawer } from "./SQLNode";
