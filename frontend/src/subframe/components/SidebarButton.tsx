"use client";
/*
 * Documentation:
 * Sidebar Button — https://app.subframe.com/0bc1b5ae3457/library?component=Sidebar+Button_315250d8-4aba-4a62-a61e-b2627fa538ec
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface SidebarButtonRootProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  text?: string;
  className?: string;
}

const SidebarButtonRoot = React.forwardRef<HTMLElement, SidebarButtonRootProps>(
  function SidebarButtonRoot(
    {
      icon = "FeatherPlus",
      text,
      className,
      ...otherProps
    }: SidebarButtonRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/315250d8 flex w-full cursor-pointer items-center gap-4 border-t border-solid border-neutral-border pt-4 pr-4 pb-4 pl-4 hover:bg-neutral-50 active:bg-neutral-100",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <SubframeCore.Icon
          className="text-heading-3 font-heading-3 text-subtext-color group-hover/315250d8:text-default-font group-active/315250d8:text-default-font"
          name={icon}
        />
        {text ? (
          <span className="text-body-bold font-body-bold text-subtext-color group-hover/315250d8:text-default-font group-active/315250d8:text-default-font">
            {text}
          </span>
        ) : null}
      </div>
    );
  }
);

export const SidebarButton = SidebarButtonRoot;
