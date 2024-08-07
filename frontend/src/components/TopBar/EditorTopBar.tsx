"use client";
/*
 * Documentation:
 * Editor Top Bar — https://app.subframe.com/0bc1b5ae3457/library?component=Editor+Top+Bar_278120cd-e892-4089-8e83-d99890aa0e63
 * Toggle Group — https://app.subframe.com/0bc1b5ae3457/library?component=Toggle+Group_2026f10a-e3cc-4c89-80da-a7259acae3b7
 * Breadcrumbs — https://app.subframe.com/0bc1b5ae3457/library?component=Breadcrumbs_8898334b-a66f-4ee8-8bd1-afcfa8e37cc0
 * Avatar — https://app.subframe.com/0bc1b5ae3457/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 * Icon Button — https://app.subframe.com/0bc1b5ae3457/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 * Dropdown Menu — https://app.subframe.com/0bc1b5ae3457/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 * Button — https://app.subframe.com/0bc1b5ae3457/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { ToggleGroup } from "../../subframe/components/ToggleGroup";
import { Breadcrumbs } from "../../subframe/components/Breadcrumbs";
import { Avatar } from "../../subframe/components/Avatar";
import { IconButton } from "../../subframe/components/IconButton";
import { DropdownMenu } from "../../subframe/components/DropdownMenu";
import { Button } from "../../subframe/components/Button";
import { useAuth } from "@/hooks/useAuth";

interface EditorTopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export default function EditorTopBar({ className, ...otherProps }: EditorTopBarProps) {
  const { logOut } = useAuth();
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
          <Breadcrumbs.Item>Your drafts</Breadcrumbs.Item>
          <Breadcrumbs.Divider />
          <Breadcrumbs.Item active={true}>New Project</Breadcrumbs.Item>
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
