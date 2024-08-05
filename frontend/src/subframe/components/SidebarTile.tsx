"use client";
/*
 * Documentation:
 * Sidebar Tile — https://app.subframe.com/0bc1b5ae3457/library?component=Sidebar+Tile_e8211096-0b1f-43b9-83d3-8be91f3e1ac0
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface SidebarTileRootProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  text?: string;
  className?: string;
}

const SidebarTileRoot = React.forwardRef<HTMLElement, SidebarTileRootProps>(
  function SidebarTileRoot(
    {
      icon = "FeatherPlus",
      text,
      className,
      ...otherProps
    }: SidebarTileRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/e8211096 flex w-full cursor-pointer flex-col items-center justify-center gap-2 bg-default-background pt-6 pr-6 pb-6 pl-6 hover:bg-neutral-50 active:bg-neutral-100",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <SubframeCore.Icon
          className="text-heading-3 font-heading-3 text-brand-700 text-neutral-900"
          name={icon}
        />
        {text ? (
          <span className="text-caption-bold font-caption-bold text-subtext-color group-hover/e8211096:text-default-font group-active/e8211096:text-default-font">
            {text}
          </span>
        ) : null}
      </div>
    );
  }
);

export const SidebarTile = SidebarTileRoot;
