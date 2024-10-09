"use client";
/*
 * Documentation:
 * Toggle Group — https://app.subframe.com/cb0b7d209a24/library?component=Toggle+Group_2026f10a-e3cc-4c89-80da-a7259acae3b7
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
          "group/56dea6ed flex h-7 w-full cursor-pointer items-center justify-center gap-2 rounded-md pt-1 pr-2 pb-1 pl-2 active:bg-neutral-100 aria-[checked=true]:bg-default-background aria-[checked=true]:shadow-default hover:aria-[checked=true]:bg-default-background active:aria-[checked=true]:bg-default-background",
          { "hover:bg-transparent active:bg-transparent": disabled },
          className
        )}
        ref={ref as any}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-body font-body text-subtext-color group-hover/56dea6ed:text-default-font group-active/56dea6ed:text-default-font group-aria-[checked=true]/56dea6ed:text-default-font",
            {
              "text-neutral-400 group-hover/56dea6ed:text-neutral-400 group-active/56dea6ed:text-neutral-400":
                disabled,
            }
          )}
          name={icon}
        />
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "whitespace-nowrap text-label-bold font-label-bold text-subtext-color group-hover/56dea6ed:text-default-font group-active/56dea6ed:text-default-font group-aria-[checked=true]/56dea6ed:text-default-font",
              {
                "text-neutral-400 group-hover/56dea6ed:text-neutral-400 group-active/56dea6ed:text-neutral-400":
                  disabled,
              }
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
  value?: string;
  onValueChange?: (value: string) => void;
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
            "flex items-center gap-0.5 overflow-hidden rounded-md bg-neutral-100 pt-0.5 pr-0.5 pb-0.5 pl-0.5",
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
