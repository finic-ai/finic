"use client";
/*
 * Documentation:
 * Default Page Layout — https://app.subframe.com/cb0b7d209a24/library?component=Default+Page+Layout_a57b1c43-310a-493f-b807-8cc88e2452cf
 * Button — https://app.subframe.com/cb0b7d209a24/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 * Icon Button — https://app.subframe.com/cb0b7d209a24/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 * Dropdown Menu — https://app.subframe.com/cb0b7d209a24/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 * Avatar — https://app.subframe.com/cb0b7d209a24/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Button } from "../components/Button";
import { IconButton } from "../components/IconButton";
import { DropdownMenu } from "../components/DropdownMenu";
import { Avatar } from "../components/Avatar";
import { EditorTopBar } from "../../layouts/TopBar";

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
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex h-screen w-full items-center bg-default-background",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex grow shrink-0 basis-0 flex-col items-start self-stretch">
        <EditorTopBar className="flex-none" />
        {children ? (
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 overflow-y-auto">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export const DefaultPageLayout = DefaultPageLayoutRoot;
