import React from "react";
import * as SubframeCore from "@subframe/core";
import { useNavigate } from "react-router-dom";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";
import { Breadcrumbs } from "@/subframe/components/Breadcrumbs";
import { Avatar } from "@/subframe/components/Avatar";
import { IconButton } from "@/subframe/components/IconButton";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { Button } from "@/subframe/components/Button";
import { AppNavButton } from "@/subframe/components/AppNavButton";
import { useAuth } from "@/hooks/useAuth";

interface AppTopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  path: string;
}
export default function AppTopBar({
  className,
  path,
  ...otherProps
}: AppTopBarProps) {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div
      className={`flex w-full px-4 flex-wrap items-center justify-center gap-4 border-b border-solid border-neutral-border bg-default-background ${className}`}
    >
      <div className="flex h-12 flex-col items-start justify-center gap-2 px-4">
        <img
          className="h-6 flex-none object-cover"
          src="https://res.cloudinary.com/subframe/image/upload/v1724010987/uploads/132/vdukkkatrcoseixgwmft.png"
        />
      </div>
      <div className="flex min-w-[320px] mx-10 grow shrink-0 basis-0 flex-wrap items-center justify-center gap-6">
        <AppNavButton
          text="Agents"
          selected={["/"].includes(path)}
          onClick={() => navigate("/")}
        />
        <AppNavButton
          text="Monitoring"
          selected={path == "/monitoring"}
          onClick={() => navigate("/monitoring")}
        />
        <AppNavButton
          text="Secrets"
          selected={path == "/secrets"}
          onClick={() => navigate("/secrets")}
        />
        <AppNavButton
          text="Settings"
          selected={path == "/settings"}
          onClick={() => navigate("/settings")}
        />
      </div>
      <div className="flex items-center gap-2 px-2">
        <SubframeCore.DropdownMenu.Root>
          <SubframeCore.DropdownMenu.Trigger asChild={true}>
            <Avatar
              size="small"
              image="https://res.cloudinary.com/subframe/image/upload/v1724011327/uploads/132/zs2vi4x6ljxiflntvdgv.png"
            >
              A
            </Avatar>
          </SubframeCore.DropdownMenu.Trigger>
          <SubframeCore.DropdownMenu.Portal>
            <SubframeCore.DropdownMenu.Content
              side="bottom"
              align="end"
              sideOffset={4}
              asChild={true}
            >
              <DropdownMenu>
                <DropdownMenu.DropdownItem
                  icon="FeatherLogOut"
                  onClick={() => logOut()}
                >
                  Sign Out
                </DropdownMenu.DropdownItem>
              </DropdownMenu>
            </SubframeCore.DropdownMenu.Content>
          </SubframeCore.DropdownMenu.Portal>
        </SubframeCore.DropdownMenu.Root>
      </div>
    </div>
  );
}
