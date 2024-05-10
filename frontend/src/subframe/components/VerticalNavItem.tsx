"use client";
/*
 * Documentation:
 * Vertical Nav Item — https://app.subframe.com/library?component=Vertical+Nav+Item_6588120a-d20f-4c9b-9777-5bd7f42447b2
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface VerticalNavItemRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  children?: string;
  icon?: SubframeCore.IconName;
  className?: string;
}

const VerticalNavItemRoot = React.forwardRef<
  HTMLElement,
  VerticalNavItemRootProps
>(function VerticalNavItemRoot(
  {
    selected = false,
    children,
    icon = "FeatherUser",
    className,
    ...otherProps
  }: VerticalNavItemRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/6588120a flex w-full cursor-pointer items-center gap-1 rounded-md border border-solid border-transparent pt-1 pr-2 pb-1 pl-2 hover:border hover:border-solid hover:border-neutral-border hover:bg-neutral-100",
        {
          "border border-solid border-neutral-border bg-neutral-100": selected,
        },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <SubframeCore.Icon
        className={SubframeCore.twClassNames(
          "text-label font-label text-subtext-color group-hover/6588120a:text-default-font",
          { "text-default-font": selected }
        )}
        name={icon}
      />
      {children ? (
        <span
          className={SubframeCore.twClassNames(
            "text-body font-body text-subtext-color group-hover/6588120a:text-default-font",
            { "text-default-font": selected }
          )}
        >
          {children}
        </span>
      ) : null}
    </div>
  );
});

export const VerticalNavItem = VerticalNavItemRoot;
