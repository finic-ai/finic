"use client";
/*
 * Documentation:
 * Radio Group — https://app.subframe.com/library?component=Radio+Group_c4b6300e-20b4-4f3e-8b9f-379a046674ca
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface OptionProps
  extends React.ComponentProps<typeof SubframeCore.RadioGroup.Item> {
  label?: string;
  className?: string;
}

const Option = React.forwardRef<HTMLElement, OptionProps>(function Option(
  { label, className, ...otherProps }: OptionProps,
  ref
) {
  return (
    <SubframeCore.RadioGroup.Item asChild={true} {...otherProps}>
      <button
        className={SubframeCore.twClassNames(
          "group/0f804ad9 flex cursor-pointer items-center gap-2 border-none bg-transparent disabled:cursor-default",
          className
        )}
        ref={ref as any}
      >
        <div className="flex h-4 items-center gap-2">
          <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-full border-2 border-solid border-neutral-300 bg-default-background group-active/0f804ad9:border-2 group-active/0f804ad9:border-solid group-active/0f804ad9:border-brand-700 group-aria-[checked=true]/0f804ad9:border-2 group-aria-[checked=true]/0f804ad9:border-solid group-aria-[checked=true]/0f804ad9:border-brand-600 group-disabled/0f804ad9:border-2 group-disabled/0f804ad9:border-solid group-disabled/0f804ad9:border-neutral-200 group-disabled/0f804ad9:bg-neutral-100 group-active/0f804ad9:group-disabled/0f804ad9:border-2 group-active/0f804ad9:group-disabled/0f804ad9:border-solid group-active/0f804ad9:group-disabled/0f804ad9:border-neutral-200">
            <div className="hidden h-2 w-2 flex-none flex-col items-start gap-2 rounded-full bg-default-background group-aria-[checked=true]/0f804ad9:flex group-aria-[checked=true]/0f804ad9:bg-brand-600 group-disabled/0f804ad9:bg-neutral-200" />
          </div>
        </div>
        {label ? (
          <span className="text-body font-body text-default-font group-disabled/0f804ad9:text-subtext-color">
            {label}
          </span>
        ) : null}
      </button>
    </SubframeCore.RadioGroup.Item>
  );
});

interface RadioGroupRootProps
  extends React.ComponentProps<typeof SubframeCore.RadioGroup.Root> {
  label?: string;
  helpText?: string;
  error?: boolean;
  horizontal?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const RadioGroupRoot = React.forwardRef<HTMLElement, RadioGroupRootProps>(
  function RadioGroupRoot(
    {
      label,
      helpText,
      error = false,
      horizontal = false,
      children,
      className,
      ...otherProps
    }: RadioGroupRootProps,
    ref
  ) {
    return (
      <SubframeCore.RadioGroup.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "group/c4b6300e flex flex-col items-start gap-2",
            className
          )}
          ref={ref as any}
        >
          {label ? (
            <span className="text-body-bold font-body-bold text-default-font">
              {label}
            </span>
          ) : null}
          {children ? (
            <div
              className={SubframeCore.twClassNames(
                "flex flex-col items-start gap-2",
                { "flex-row gap-6": horizontal }
              )}
            >
              {children}
            </div>
          ) : null}
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
        </div>
      </SubframeCore.RadioGroup.Root>
    );
  }
);

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Option,
});
