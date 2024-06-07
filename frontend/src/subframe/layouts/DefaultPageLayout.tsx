"use client";
/*
 * Documentation:
 * Default Page Layout — https://app.subframe.com/library?component=Default+Page+Layout_a57b1c43-310a-493f-b807-8cc88e2452cf
 * Icon Button — https://app.subframe.com/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 * Dropdown Menu — https://app.subframe.com/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 * Avatar — https://app.subframe.com/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 */

// @subframe/sync-disable

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Sidebar } from "../components/Sidebar";
import { IconButton } from "../components/IconButton";
import { DropdownMenu } from "../components/DropdownMenu";
import { Button } from "../components/Button";
import { Avatar } from "../components/Avatar";
import { useUserStateContext } from "../../context/UserStateContext";
import supabase from "../../lib/supabaseClient";
import { useLocation } from 'react-router-dom';

interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DefaultPageLayoutRoot = React.forwardRef<
  HTMLElement,
  DefaultPageLayoutRootProps
>(function DefaultPageLayoutRoot(
  { children, className, ...otherProps }: DefaultPageLayoutRootProps,
  ref
) {
  const location = useLocation();
  const { isLoggedIn, avatarUrl, firstName, authState } = useUserStateContext();
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex h-screen w-full items-center bg-default-background",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <Sidebar
        className="h-full w-56 flex-none"
        hideLogo={false}
        logoImage="https://res.cloudinary.com/subframe/image/upload/v1711487224/uploads/132/s1sz3csmgplv8dnu1js7.png"
      >
        <Sidebar.Item selected={location.pathname === "/diligence"}
          onClick={() => {
            window.location.href = "/diligence";
          }}
        >Diligence AI</Sidebar.Item>
        {/* <Sidebar.Item icon="FeatherBarChart"
          onClick={() => {
            window.location.href = "/lois";
          }}>LOIs</Sidebar.Item> */}
        <Sidebar.Item selected ={location.pathname === "/"} icon="FeatherDatabase" 
          onClick={() => {
            window.location.href = "/";
          }}>Find a Lender</Sidebar.Item>
        {/* <Sidebar.Item icon="FeatherSettings">Settings</Sidebar.Item> */}
      </Sidebar>
      <div className="flex h-full w-full grow shrink-0 basis-0 flex-col items-start">
        <div className="flex w-full items-center justify-between border-l-0 border-solid border-neutral-border pt-2 pr-4 pb-2 pl-4">
          <div className="flex w-full grow shrink-0 basis-0 items-center gap-4">
            <div className="flex w-full grow shrink-0 basis-0 items-start justify-center gap-2">
            </div>
            {/* <IconButton
              disabled={false}
              variant="neutral-tertiary"
              size="large"
              icon="FeatherHelpCircle"
              loading={false}
            /> */}
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Avatar
                  className="cursor-pointer"
                  image={
                    avatarUrl
                      ? avatarUrl
                      : "https://res.cloudinary.com/subframe/image/upload/v1715365107/uploads/132/axxegsbktgi1g9ud3683.png"
                  }
                />
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={8}
                  asChild={true}
                >
                  <DropdownMenu>
                    {/* <DropdownMenu.DropdownItem icon="FeatherMailPlus">
                      Refer a company
                    </DropdownMenu.DropdownItem> */}
                    <DropdownMenu.DropdownItem
                      icon="FeatherLogOut"
                      onClick={() => {
                        console.log("Logging out");
                        supabase.auth.signOut({ scope: "global" });
                      }}
                    >
                      Log out
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
          </div>
        </div>
        {children ? (
          <div className="flex h-full w-full grow shrink-0 basis-0 flex-col items-start gap-4 overflow-y-auto">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export const DefaultPageLayout = DefaultPageLayoutRoot;
