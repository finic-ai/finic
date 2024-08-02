"use client";
/*
 * Documentation:
 * Checkbox — https://app.subframe.com/library?component=Checkbox_3816e3b5-c48c-499b-b45e-0777c6972523
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface CheckboxRootProps
  extends React.ComponentProps<typeof SubframeCore.Checkbox.Root> {
  label?: string;
  className?: string;
}

const CheckboxRoot = React.forwardRef<HTMLElement, CheckboxRootProps>(
  function CheckboxRoot(
    { label, className, ...otherProps }: CheckboxRootProps,
    ref
  ) {
    return (
      <SubframeCore.Checkbox.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "group/3816e3b5 flex cursor-pointer items-center gap-2",
            className
          )}
          ref={ref as any}
        >
          <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 bg-default-background group-active/3816e3b5:border-2 group-active/3816e3b5:border-solid group-active/3816e3b5:border-brand-600 group-focus-within/3816e3b5:border-2 group-focus-within/3816e3b5:border-solid group-focus-within/3816e3b5:border-brand-600 group-aria-[checked=true]/3816e3b5:border group-aria-[checked=true]/3816e3b5:border-solid group-aria-[checked=true]/3816e3b5:border-brand-600 group-aria-[checked=true]/3816e3b5:bg-brand-600 group-active/3816e3b5:group-aria-[checked=true]/3816e3b5:border-2 group-active/3816e3b5:group-aria-[checked=true]/3816e3b5:border-solid group-active/3816e3b5:group-aria-[checked=true]/3816e3b5:border-brand-500 group-active/3816e3b5:group-aria-[checked=true]/3816e3b5:bg-brand-500 group-focus-within/3816e3b5:group-aria-[checked=true]/3816e3b5:border-2 group-focus-within/3816e3b5:group-aria-[checked=true]/3816e3b5:border-solid group-focus-within/3816e3b5:group-aria-[checked=true]/3816e3b5:border-brand-500 group-focus-within/3816e3b5:group-aria-[checked=true]/3816e3b5:bg-brand-500 group-disabled/3816e3b5:border-2 group-disabled/3816e3b5:border-solid group-disabled/3816e3b5:border-neutral-200 group-disabled/3816e3b5:bg-neutral-100 group-active/3816e3b5:group-disabled/3816e3b5:border-2 group-active/3816e3b5:group-disabled/3816e3b5:border-solid group-active/3816e3b5:group-disabled/3816e3b5:border-neutral-200">
            <SubframeCore.Icon
              className="hidden text-body font-body text-white group-aria-[checked=true]/3816e3b5:inline-flex group-aria-[checked=true]/3816e3b5:text-[14px] group-aria-[checked=true]/3816e3b5:font-[600] group-aria-[checked=true]/3816e3b5:leading-[14px] group-disabled/3816e3b5:text-neutral-400"
              name="FeatherCheck"
            />
          </div>
          {label ? (
            <span className="text-body font-body text-default-font group-disabled/3816e3b5:text-subtext-color">
              {label}
            </span>
          ) : null}
        </div>
      </SubframeCore.Checkbox.Root>
    );
  }
);

export const Checkbox = CheckboxRoot;
