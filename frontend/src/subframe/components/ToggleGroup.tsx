"use client";
/*
 * Documentation:
 * Toggle Group — https://app.subframe.com/library?component=Toggle+Group_2026f10a-e3cc-4c89-80da-a7259acae3b7
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ItemProps
  extends React.ComponentProps<typeof SubframeCore.ToggleGroup.Item> {
  disabled?: boolean;
  children?: string;
  icon?: SubframeCore.IconName;
  className?: string;
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  {
    disabled = false,
    children,
    icon = "FeatherStar",
    className,
    ...otherProps
  }: ItemProps,
  ref
) {
  return (
    <SubframeCore.ToggleGroup.Item asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "group/56dea6ed flex h-8 w-full cursor-pointer items-center justify-center gap-2 bg-white pr-3 pl-3 hover:bg-neutral-50 active:bg-neutral-100 aria-[checked=true]:bg-brand-50 hover:aria-[checked=true]:bg-brand-50 active:aria-[checked=true]:bg-brand-100",
          { "hover:bg-white active:bg-white": disabled },
          className
        )}
        ref={ref as any}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-[16px] font-[400] leading-[16px] text-subtext-color group-aria-[checked=true]/56dea6ed:text-brand-700",
            { "text-neutral-400": disabled }
          )}
          name={icon}
        />
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "whitespace-nowrap text-body-bold font-body-bold text-subtext-color group-aria-[checked=true]/56dea6ed:text-brand-700",
              { "text-neutral-400": disabled }
            )}
          >
            {children}
          </span>
        ) : null}
      </div>
    </SubframeCore.ToggleGroup.Item>
  );
});

interface ToggleGroupRootProps
  extends React.ComponentProps<typeof SubframeCore.ToggleGroup.Root> {
  children?: React.ReactNode;
  className?: string;
}

const ToggleGroupRoot = React.forwardRef<HTMLElement, ToggleGroupRootProps>(
  function ToggleGroupRoot(
    { children, className, ...otherProps }: ToggleGroupRootProps,
    ref
  ) {
    return children ? (
      <SubframeCore.ToggleGroup.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex items-start gap-px overflow-hidden rounded border border-solid border-neutral-border bg-neutral-border",
            className
          )}
          ref={ref as any}
        >
          {children}
        </div>
      </SubframeCore.ToggleGroup.Root>
    ) : null;
  }
);

export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item,
});
