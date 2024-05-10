"use client";
/*
 * Documentation:
 * Dropdown Button — https://app.subframe.com/library?component=Dropdown+Button_0d533080-af9c-4d40-85cc-332490a1a191
 * Dropdown Menu — https://app.subframe.com/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface DropdownButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "small" | "x-small";
  icon?: SubframeCore.IconName;
  children?: string;
  dropdownMenu?: React.ReactNode;
  className?: string;
}

const DropdownButtonRoot = React.forwardRef<
  HTMLElement,
  DropdownButtonRootProps
>(function DropdownButtonRoot(
  {
    size = "default",
    icon = null,
    children,
    dropdownMenu,
    className,
    type = "button",
    ...otherProps
  }: DropdownButtonRootProps,
  ref
) {
  return (
    <SubframeCore.DropdownMenu.Root>
      <SubframeCore.DropdownMenu.Trigger asChild={true}>
        <button
          className={SubframeCore.twClassNames(
            "group/0d533080 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-solid border-neutral-border bg-default-background pr-4 pl-4 hover:bg-neutral-50 active:bg-neutral-100 disabled:cursor-default disabled:bg-neutral-200 hover:disabled:cursor-default hover:disabled:bg-neutral-200 active:disabled:cursor-default active:disabled:bg-neutral-200",
            {
              "h-6 w-auto flex-row gap-1 pt-0 pr-2 pb-0 pl-2":
                size === "x-small",
              "h-8 w-auto flex-row gap-1 pt-0 pr-3 pb-0 pl-3": size === "small",
            },
            className
          )}
          ref={ref as any}
          type={type}
          {...otherProps}
        >
          <SubframeCore.Icon
            className={SubframeCore.twClassNames(
              "text-[16px] font-[400] leading-[20px] text-neutral-700 group-disabled/0d533080:text-neutral-400 group-hover/0d533080:group-disabled/0d533080:text-neutral-400 group-active/0d533080:group-disabled/0d533080:text-neutral-400",
              {
                "text-label font-label": size === "x-small" || size === "small",
              }
            )}
            name={icon}
          />
          <div
            className={SubframeCore.twClassNames(
              "hidden h-4 w-4 flex-none items-center justify-center gap-2",
              { "h-3 w-3 flex-none": size === "x-small" || size === "small" }
            )}
          >
            <SubframeCore.Loader
              className={SubframeCore.twClassNames(
                "text-body font-body text-white group-disabled/0d533080:text-neutral-400",
                {
                  "text-label font-label":
                    size === "x-small" || size === "small",
                }
              )}
            />
          </div>
          {children ? (
            <span
              className={SubframeCore.twClassNames(
                "text-body-bold font-body-bold text-neutral-700 group-disabled/0d533080:text-neutral-400",
                {
                  "text-label-bold font-label-bold":
                    size === "x-small" || size === "small",
                }
              )}
            >
              {children}
            </span>
          ) : null}
          <SubframeCore.Icon
            className={SubframeCore.twClassNames(
              "text-body font-body text-neutral-700 group-disabled/0d533080:text-neutral-400",
              {
                "text-label-bold font-label-bold":
                  size === "x-small" || size === "small",
              }
            )}
            name="FeatherChevronDown"
          />
        </button>
      </SubframeCore.DropdownMenu.Trigger>
      <SubframeCore.DropdownMenu.Portal>
        <SubframeCore.DropdownMenu.Content
          side="bottom"
          align="start"
          sideOffset={8}
          asChild={true}
        >
          {dropdownMenu ? (
            <div className="flex items-start justify-between">
              {dropdownMenu}
            </div>
          ) : null}
        </SubframeCore.DropdownMenu.Content>
      </SubframeCore.DropdownMenu.Portal>
    </SubframeCore.DropdownMenu.Root>
  );
});

export const DropdownButton = DropdownButtonRoot;
