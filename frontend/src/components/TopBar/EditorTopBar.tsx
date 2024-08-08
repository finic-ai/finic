import React from "react";
import { useNavigate } from "react-router-dom";
import * as SubframeCore from "@subframe/core";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";
import { Breadcrumbs } from "@/subframe/components/Breadcrumbs";
import { Avatar } from "@/subframe/components/Avatar";
import { IconButton } from "@/subframe/components/IconButton";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { Button } from "@/subframe/components/Button";
import { useAuth } from "@/hooks/useAuth";

interface EditorTopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  workflowName?: string;
}
export default function EditorTopBar({ className, workflowName }: EditorTopBarProps) {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={`flex w-full items-center gap-2 border-b border-solid border-neutral-border bg-default-background pt-3 pr-4 pb-3 pl-4 ${className}`}>
      <div className="flex grow shrink-0 basis-0 items-center gap-4">
        <img
          className="h-6 flex-none"
          src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
        />
        <ToggleGroup>
          <ToggleGroup.Item icon={null} value="2f498b92">
            Editor
          </ToggleGroup.Item>
          <ToggleGroup.Item icon={null} value="b1b04b29">
            Preview
          </ToggleGroup.Item>
        </ToggleGroup>
      </div>
      <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-2 self-stretch">
        <Breadcrumbs>
          <Breadcrumbs.Item onClick={() => navigate("/")}>Workflows</Breadcrumbs.Item>
          <Breadcrumbs.Divider />
          <Breadcrumbs.Item active={true}>{workflowName ? workflowName : "New Workflow"}</Breadcrumbs.Item>
        </Breadcrumbs>
      </div>
      <div className="flex grow shrink-0 basis-0 items-center justify-end gap-2 self-stretch">
        <Avatar
          size="small"
          image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
        >
          AB
        </Avatar>
        <IconButton icon="FeatherSearch" />
        <SubframeCore.DropdownMenu.Root>
          <SubframeCore.DropdownMenu.Trigger asChild={true}>
            <IconButton icon="FeatherMoreHorizontal" />
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
        <Button onClick={() => logOut()}>Publish</Button>
      </div>
    </div>
  );
};
