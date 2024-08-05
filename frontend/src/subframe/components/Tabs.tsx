"use client";
/*
 * Documentation:
 * Tabs — https://app.subframe.com/cb0b7d209a24/library?component=Tabs_e1ad5091-8ad8-4319-b1f7-3e47f0256c20
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  disabled?: boolean;
  icon?: SubframeCore.IconName;
  children?: string;
  className?: string;
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  {
    active = false,
    disabled = false,
    icon = null,
    children,
    className,
    ...otherProps
  }: ItemProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/d5612535 flex h-10 cursor-pointer items-center justify-center gap-2 border-b border-solid border-neutral-border pt-0.5 pr-2.5 pb-0.5 pl-2.5",
        {
          "border-b-2 border-solid border-brand-600 pt-0.5 pr-2.5 pb-px pl-2.5 hover:border-b-2 hover:border-solid hover:border-brand-600":
            active,
        },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <SubframeCore.Icon
        className={SubframeCore.twClassNames(
          "text-body font-body text-subtext-color group-hover/d5612535:text-default-font",
          {
            "text-neutral-400 group-hover/d5612535:text-neutral-400": disabled,
            "text-brand-700 group-hover/d5612535:text-brand-700": active,
          }
        )}
        name={icon}
      />
      {children ? (
        <span
          className={SubframeCore.twClassNames(
            "text-body-bold font-body-bold text-subtext-color group-hover/d5612535:text-default-font",
            {
              "text-neutral-400 group-hover/d5612535:text-neutral-400":
                disabled,
              "text-brand-700 group-hover/d5612535:text-brand-700": active,
            }
          )}
        >
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface TabsRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const TabsRoot = React.forwardRef<HTMLElement, TabsRootProps>(function TabsRoot(
  { children, className, ...otherProps }: TabsRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames("flex w-full items-end", className)}
      ref={ref as any}
      {...otherProps}
    >
      {children ? (
        <div className="flex items-start self-stretch">{children}</div>
      ) : null}
      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 self-stretch border-b border-solid border-neutral-border" />
    </div>
  );
});

export const Tabs = Object.assign(TabsRoot, {
  Item,
});
