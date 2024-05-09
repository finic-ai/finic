"use client";
/*
 * Documentation:
 * Dropdown Menu — https://app.subframe.com/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface DropdownItemProps
  extends React.ComponentProps<typeof SubframeCore.DropdownMenu.Item> {
  children?: string;
  icon?: SubframeCore.IconName;
  className?: string;
}

const DropdownItem = React.forwardRef<HTMLElement, DropdownItemProps>(
  function DropdownItem(
    {
      children,
      icon = "FeatherStar",
      className,
      ...otherProps
    }: DropdownItemProps,
    ref
  ) {
    return (
      <SubframeCore.DropdownMenu.Item asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "group/adcae8d6 flex h-8 w-full cursor-pointer items-center gap-2 rounded pr-3 pl-3 hover:bg-neutral-100 active:bg-neutral-50 data-[highlighted]:bg-neutral-100",
            className
          )}
          ref={ref as any}
        >
          <SubframeCore.Icon
            className="text-body font-body text-subtext-color"
            name={icon}
          />
          {children ? (
            <span className="line-clamp-1 w-full grow shrink-0 basis-0 text-body font-body text-default-font group-hover/adcae8d6:text-default-font">
              {children}
            </span>
          ) : null}
        </div>
      </SubframeCore.DropdownMenu.Item>
    );
  }
);

interface DropdownMenuRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DropdownMenuRoot = React.forwardRef<HTMLElement, DropdownMenuRootProps>(
  function DropdownMenuRoot(
    { children, className, ...otherProps }: DropdownMenuRootProps,
    ref
  ) {
    return children ? (
      <div
        className={SubframeCore.twClassNames(
          "flex min-w-[192px] flex-col items-start rounded border border-solid border-neutral-border bg-default-background pt-1 pr-1 pb-1 pl-1 shadow-overlay",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children}
      </div>
    ) : null;
  }
);

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  DropdownItem,
});
