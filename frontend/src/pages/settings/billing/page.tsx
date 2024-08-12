import * as SubframeCore from "@subframe/core";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";
import { Breadcrumbs } from "@/subframe/components/Breadcrumbs";
import { Avatar } from "@/subframe/components/Avatar";
import { IconButton } from "@/subframe/components/IconButton";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { Button } from "@/subframe/components/Button";

interface SettingsLayoutProps {
  children?: React.ReactNode;
  workflowName: string;
}

function SettingsLayout({ children, workflowName }: SettingsLayoutProps) {
  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className="flex h-full w-full flex-col items-start bg-default-background">
      <div className="flex w-full items-center gap-2 border-b border-solid border-neutral-border pt-3 pr-4 pb-3 pl-4">
        <div className="flex grow shrink-0 basis-0 items-center gap-4">
          <img
            className="h-6 flex-none object-cover"
            src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
          />
          <ToggleGroup value="" onValueChange={(value: string) => {}}>
            <ToggleGroup.Item icon={null} value="6846b253">
              Editor
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="a27ef893">
              Preview
            </ToggleGroup.Item>
          </ToggleGroup>
        </div>
        <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-2 self-stretch">
          <Breadcrumbs>
            <Breadcrumbs.Item>Workflows</Breadcrumbs.Item>
            <Breadcrumbs.Divider />
            <Breadcrumbs.Item>Test Workflow</Breadcrumbs.Item>
            <Breadcrumbs.Divider />
            <Breadcrumbs.Item active={true}>Settings</Breadcrumbs.Item>
          </Breadcrumbs>
        </div>
        <div className="flex grow shrink-0 basis-0 items-center justify-end gap-2 self-stretch">
          <Avatar
            size="small"
            image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
          >
            A
          </Avatar>
          <IconButton
            icon="FeatherSearch"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          />
          <SubframeCore.DropdownMenu.Root>
            <SubframeCore.DropdownMenu.Trigger asChild={true}>
              <IconButton
                icon="FeatherMoreHorizontal"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
            </SubframeCore.DropdownMenu.Trigger>
            <SubframeCore.DropdownMenu.Portal>
              <SubframeCore.DropdownMenu.Content
                side="bottom"
                align="end"
                sideOffset={4}
                asChild={true}
              >
                <DropdownMenu>
                  <DropdownMenu.DropdownItem icon="FeatherFile">
                    Save draft
                  </DropdownMenu.DropdownItem>
                  <DropdownMenu.DropdownItem icon="FeatherWrench">
                    Advanced settings
                  </DropdownMenu.DropdownItem>
                  <DropdownMenu.DropdownItem icon="FeatherTrash">
                    Delete
                  </DropdownMenu.DropdownItem>
                </DropdownMenu>
              </SubframeCore.DropdownMenu.Content>
            </SubframeCore.DropdownMenu.Portal>
          </SubframeCore.DropdownMenu.Root>
          <Button
            variant="brand-tertiary"
            icon="FeatherX"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          >
            Close
          </Button>
        </div>
      </div>
      <div className="flex w-60 grow shrink-0 basis-0 flex-col items-start gap-8 bg-brand-50 pt-6 pr-6 pb-6 pl-6">
        <span className="w-full text-heading-3 font-heading-3 text-default-font">
          Settings
        </span>
        <div className="flex w-full flex-col items-start gap-2">
          <span className="w-full text-body-bold font-body-bold text-default-font">
            Workflow
          </span>
          <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
            <SubframeCore.Icon
              className="text-body font-body text-default-font"
              name="FeatherBellRing"
            />
            <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
              Alerts
            </span>
          </div>
          <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
            <SubframeCore.Icon
              className="text-body font-body text-default-font"
              name="FeatherCalendarClock"
            />
            <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
              Scheduling
            </span>
          </div>
          <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
            <SubframeCore.Icon
              className="text-body font-body text-default-font"
              name="FeatherPlaneTakeoff"
            />
            <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
              Deployment
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          <span className="w-full text-body-bold font-body-bold text-default-font">
            Workspace
          </span>
          <div className="flex w-full flex-col items-start gap-1">
            <div className="flex h-8 w-full flex-none items-center gap-2 rounded bg-brand-100 pt-1 pr-3 pb-1 pl-3">
              <SubframeCore.Icon
                className="text-body font-body text-brand-700"
                name="FeatherUser"
              />
              <span className="line-clamp-1 grow shrink-0 basis-0 text-body-bold font-body-bold text-brand-700">
                Account
              </span>
            </div>
            <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name="FeatherLock"
              />
              <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
                API Keys
              </span>
            </div>
            <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name="FeatherCreditCard"
              />
              <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
                Billing
              </span>
            </div>
            <div className="flex h-8 w-full flex-none items-center gap-2 rounded pt-1 pr-3 pb-1 pl-3">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name="FeatherShapes"
              />
              <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
                Integrations
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage({
  children,
  workflowName,
}: SettingsLayoutProps) {
  return (
    <SettingsLayout workflowName={workflowName}>{children}</SettingsLayout>
  );
}

// export { default as GenerativeAINode, GenerativeAINodeConfigurationDrawer } from "./GenerativeAINode";
// export { default as JoinNode, JoinNodeConfigurationDrawer } from "./JoinNode";
// export { default as MappingNode, MappingNodeConfigurationDrawer } from "./MappingNode";
// export { default as PythonNode, PythonNodeConfigurationDrawer } from "./PythonNode";
// export { default as ConditionalNode, ConditionalNodeConfigurationDrawer } from "./ConditionalNode";
// export { default as FilterNode, FilterNodeConfigurationDrawer } from "./FilterNode";
// export { default as SourceNode, SourceNodeConfigurationDrawer } from "./SourceNode";
// export { default as DestinationNode, DestinationNodeConfigurationDrawer } from "./DestinationNode";
// export { default as SplitNode, SplitNodeConfigurationDrawer } from "./SplitNode";
// export { default as SQLNode, SQLNodeConfigurationDrawer } from "./SQLNode";
