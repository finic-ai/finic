"use client";
/*
 * Documentation:
 * Checkbox Card — https://app.subframe.com/library?component=Checkbox+Card_de0b4dfb-3946-4702-be52-5678dd71925a
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface CheckboxCardRootProps
  extends React.ComponentProps<typeof SubframeCore.Checkbox.Root> {
  hideCheckbox?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const CheckboxCardRoot = React.forwardRef<HTMLElement, CheckboxCardRootProps>(
  function CheckboxCardRoot(
    {
      hideCheckbox = false,
      children,
      className,
      ...otherProps
    }: CheckboxCardRootProps,
    ref
  ) {
    return (
      <SubframeCore.Checkbox.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "group/de0b4dfb flex cursor-pointer items-center gap-4 rounded border border-solid border-neutral-border bg-default-background pt-3 pr-4 pb-3 pl-4 hover:border hover:border-solid hover:border-neutral-border hover:bg-neutral-50 aria-[checked=true]:border aria-[checked=true]:border-solid aria-[checked=true]:border-brand-200 aria-[checked=true]:bg-brand-50 disabled:cursor-default disabled:border disabled:border-solid disabled:border-neutral-200 disabled:bg-neutral-100",
            className
          )}
          ref={ref as any}
        >
          <div
            className={SubframeCore.twClassNames(
              "flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-sm border-2 border-solid border-neutral-300 group-aria-[checked=true]/de0b4dfb:border group-aria-[checked=true]/de0b4dfb:border-solid group-aria-[checked=true]/de0b4dfb:border-brand-600 group-aria-[checked=true]/de0b4dfb:bg-brand-600 group-disabled/de0b4dfb:border-2 group-disabled/de0b4dfb:border-solid group-disabled/de0b4dfb:border-neutral-200 group-disabled/de0b4dfb:bg-neutral-100",
              { hidden: hideCheckbox }
            )}
          >
            <SubframeCore.Icon
              className="hidden text-[14px] font-[400] leading-[14px] text-white group-aria-[checked=true]/de0b4dfb:inline-flex group-aria-[checked=true]/de0b4dfb:text-[16px] group-aria-[checked=true]/de0b4dfb:font-[400] group-aria-[checked=true]/de0b4dfb:leading-[16px] group-disabled/de0b4dfb:text-neutral-400"
              name="FeatherCheck"
            />
          </div>
          {children ? (
            <div className="flex w-full grow shrink-0 basis-0 items-center gap-4">
              {children}
            </div>
          ) : null}
        </div>
      </SubframeCore.Checkbox.Root>
    );
  }
);

export const CheckboxCard = CheckboxCardRoot;
