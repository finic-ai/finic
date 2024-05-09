"use client";
/*
 * Documentation:
 * Sidebar — https://app.subframe.com/library?component=Sidebar_1651a160-3525-494a-b02c-03db4e8516b1
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  children?: string;
  selected?: boolean;
  className?: string;
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  {
    icon = "FeatherHome",
    children,
    selected = false,
    className,
    ...otherProps
  }: ItemProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/02cd1448 flex w-full cursor-pointer items-center gap-2 rounded pt-2 pr-3 pb-2 pl-3 hover:bg-neutral-50",
        { "bg-neutral-100": selected },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex items-start gap-2 pb-0.5">
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-[18px] font-[500] leading-[28px] text-neutral-500 group-hover/02cd1448:text-neutral-800",
            { "text-neutral-900": selected }
          )}
          name={icon}
        />
      </div>
      {children ? (
        <span
          className={SubframeCore.twClassNames(
            "text-body-bold font-body-bold text-neutral-600 group-hover/02cd1448:text-neutral-800",
            { "text-neutral-900": selected }
          )}
        >
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface SidebarRootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  hideLogo?: boolean;
  logoImage?: string;
  className?: string;
}

const SidebarRoot = React.forwardRef<HTMLElement, SidebarRootProps>(
  function SidebarRoot(
    {
      children,
      hideLogo = false,
      logoImage,
      className,
      ...otherProps
    }: SidebarRootProps,
    ref
  ) {
    return (
      <nav
        className={SubframeCore.twClassNames(
          "group/1651a160 flex h-full w-48 flex-col items-start gap-6 border-r border-solid border-neutral-border bg-white pt-5",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div
          className={SubframeCore.twClassNames(
            "flex w-full flex-col items-start gap-2 pr-6 pl-6",
            { hidden: hideLogo }
          )}
        >
          {logoImage ? <img className="h-9 flex-none" src={logoImage} /> : null}
        </div>
        {children ? (
          <div className="flex h-full w-full grow shrink-0 basis-0 flex-col items-start gap-1 pr-3 pl-3">
            {children}
          </div>
        ) : null}
      </nav>
    );
  }
);

export const Sidebar = Object.assign(SidebarRoot, {
  Item,
});
