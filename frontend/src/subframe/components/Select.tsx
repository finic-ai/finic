"use client";
/*
 * Documentation:
 * Select — https://app.subframe.com/library?component=Select_bb88f90b-8c43-4b73-9c2f-3558ce7838f3
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ItemProps
  extends React.ComponentProps<typeof SubframeCore.Select.Item> {
  value: string;
  children?: string;
  className?: string;
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  { value, children, className, ...otherProps }: ItemProps,
  ref
) {
  return (
    <SubframeCore.Select.Item value={value} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "group/969e345b flex h-8 w-full cursor-pointer items-center gap-1 rounded pr-3 pl-3 hover:bg-neutral-100 active:bg-neutral-50 data-[highlighted]:bg-brand-50",
          className
        )}
        ref={ref as any}
      >
        <Select.ItemText>{children || value}</Select.ItemText>
        <SubframeCore.Icon
          className="hidden text-body font-body text-default-font group-hover/969e345b:hidden group-data-[state=checked]/969e345b:inline-flex group-data-[state=checked]/969e345b:text-brand-600"
          name="FeatherCheck"
        />
      </div>
    </SubframeCore.Select.Item>
  );
});

interface TriggerValueProps
  extends React.ComponentProps<typeof SubframeCore.Select.Value> {
  placeholder?: string;
  className?: string;
}

const TriggerValue = React.forwardRef<HTMLElement, TriggerValueProps>(
  function TriggerValue(
    { placeholder, className, ...otherProps }: TriggerValueProps,
    ref
  ) {
    return (
      <SubframeCore.Select.Value
        className={SubframeCore.twClassNames(
          "w-full whitespace-nowrap text-body font-body text-default-font",
          className
        )}
        ref={ref as any}
        placeholder={placeholder}
        {...otherProps}
      >
        Value
      </SubframeCore.Select.Value>
    );
  }
);

interface ContentProps
  extends React.ComponentProps<typeof SubframeCore.Select.Content> {
  children?: React.ReactNode;
  className?: string;
}

const Content = React.forwardRef<HTMLElement, ContentProps>(function Content(
  { children, className, ...otherProps }: ContentProps,
  ref
) {
  return children ? (
    <SubframeCore.Select.Content asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex w-full flex-col items-start overflow-hidden rounded border border-solid border-neutral-border bg-white pt-1 pr-1 pb-1 pl-1 shadow-overlay",
          className
        )}
        ref={ref as any}
      >
        {children}
      </div>
    </SubframeCore.Select.Content>
  ) : null;
});

interface TriggerProps
  extends React.ComponentProps<typeof SubframeCore.Select.Trigger> {
  placeholder?: string;
  icon?: SubframeCore.IconName;
  className?: string;
}

const Trigger = React.forwardRef<HTMLElement, TriggerProps>(function Trigger(
  { placeholder, icon = null, className, ...otherProps }: TriggerProps,
  ref
) {
  return (
    <SubframeCore.Select.Trigger asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex h-full w-full items-center gap-2 pr-3 pl-3",
          className
        )}
        ref={ref as any}
      >
        <SubframeCore.Icon
          className="text-body font-body text-neutral-400"
          name={icon}
        />
        <Select.TriggerValue placeholder={placeholder} />
        <SubframeCore.Icon
          className="text-body font-body text-subtext-color"
          name="FeatherChevronDown"
        />
      </div>
    </SubframeCore.Select.Trigger>
  );
});

interface ItemTextProps
  extends React.ComponentProps<typeof SubframeCore.Select.ItemText> {
  children?: string;
  className?: string;
}

const ItemText = React.forwardRef<HTMLElement, ItemTextProps>(function ItemText(
  { children, className, ...otherProps }: ItemTextProps,
  ref
) {
  return children ? (
    <SubframeCore.Select.ItemText {...otherProps}>
      <span
        className={SubframeCore.twClassNames(
          "text-body font-body text-default-font",
          className
        )}
        ref={ref as any}
      >
        {children}
      </span>
    </SubframeCore.Select.ItemText>
  ) : null;
});

interface SelectRootProps
  extends React.ComponentProps<typeof SubframeCore.Select.Root> {
  error?: boolean;
  variant?: "outline" | "filled";
  label?: string;
  placeholder?: string;
  helpText?: string;
  icon?: SubframeCore.IconName;
  children?: React.ReactNode;
  className?: string;
}

const SelectRoot = React.forwardRef<HTMLElement, SelectRootProps>(
  function SelectRoot(
    {
      error = false,
      variant = "outline",
      label,
      placeholder,
      helpText,
      icon = null,
      children,
      className,
      ...otherProps
    }: SelectRootProps,
    ref
  ) {
    return (
      <SubframeCore.Select.Root {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "group/bb88f90b flex cursor-pointer flex-col items-start gap-1",
            className
          )}
          ref={ref as any}
        >
          {label ? (
            <span className="text-body-bold font-body-bold text-default-font">
              {label}
            </span>
          ) : null}
          <div
            className={SubframeCore.twClassNames(
              "flex h-8 w-full flex-none flex-col items-start rounded border border-solid border-neutral-border bg-default-background group-focus-within/bb88f90b:border group-focus-within/bb88f90b:border-solid group-focus-within/bb88f90b:border-brand-primary group-disabled/bb88f90b:bg-neutral-100",
              {
                "border border-solid border-neutral-100 bg-neutral-100 group-hover/bb88f90b:border group-hover/bb88f90b:border-solid group-hover/bb88f90b:border-neutral-border group-hover/bb88f90b:bg-neutral-100":
                  variant === "filled",
                "border border-solid border-error-600": error,
              }
            )}
          >
            <Trigger placeholder={placeholder} icon={icon} />
          </div>
          {helpText ? (
            <span
              className={SubframeCore.twClassNames(
                "text-caption font-caption text-subtext-color",
                { "text-error-700": error }
              )}
            >
              {helpText}
            </span>
          ) : null}
          <Content>
            {children ? (
              <div className="flex h-full w-full grow shrink-0 basis-0 flex-col items-start">
                {children}
              </div>
            ) : null}
          </Content>
        </div>
      </SubframeCore.Select.Root>
    );
  }
);

export const Select = Object.assign(SelectRoot, {
  Item,
  TriggerValue,
  Content,
  Trigger,
  ItemText,
});
