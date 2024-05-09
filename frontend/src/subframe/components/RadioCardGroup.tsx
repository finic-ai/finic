"use client";
/*
 * Documentation:
 * Radio Card Group — https://app.subframe.com/library?component=Radio+Card+Group_6d5193b8-6043-4dc1-aad5-7f902ef872df
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface RadioCardProps
  extends React.ComponentProps<typeof SubframeCore.RadioGroup.Item> {
  hideRadio?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const RadioCard = React.forwardRef<HTMLElement, RadioCardProps>(
  function RadioCard(
    { hideRadio = false, children, className, ...otherProps }: RadioCardProps,
    ref
  ) {
    return (
      <SubframeCore.RadioGroup.Item asChild={true} {...otherProps}>
        <button
          className={SubframeCore.twClassNames(
            "group/502d4919 flex w-full cursor-pointer items-center gap-4 rounded border border-solid border-neutral-200 bg-default-background pt-3 pr-4 pb-3 pl-4 hover:bg-neutral-50 aria-[checked=true]:border aria-[checked=true]:border-solid aria-[checked=true]:border-brand-200 aria-[checked=true]:bg-brand-50 hover:aria-[checked=true]:bg-brand-50 disabled:cursor-default disabled:border disabled:border-solid disabled:border-neutral-100 disabled:bg-neutral-50 hover:disabled:cursor-default hover:disabled:bg-neutral-50",
            className
          )}
          ref={ref as any}
        >
          <div
            className={SubframeCore.twClassNames(
              "flex items-start gap-2 rounded-full pt-0.5",
              { hidden: hideRadio }
            )}
          >
            <div className="flex h-4 w-4 flex-none flex-col items-center justify-center gap-2 rounded-full border-2 border-solid border-neutral-300 group-aria-[checked=true]/502d4919:border-2 group-aria-[checked=true]/502d4919:border-solid group-aria-[checked=true]/502d4919:border-brand-600 group-disabled/502d4919:border-2 group-disabled/502d4919:border-solid group-disabled/502d4919:border-neutral-300 group-disabled/502d4919:bg-neutral-100">
              <div className="hidden h-2 w-2 flex-none flex-col items-start gap-2 rounded-full bg-white group-aria-[checked=true]/502d4919:flex group-aria-[checked=true]/502d4919:bg-brand-600 group-disabled/502d4919:bg-neutral-300" />
            </div>
          </div>
          {children ? (
            <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2">
              {children}
            </div>
          ) : null}
        </button>
      </SubframeCore.RadioGroup.Item>
    );
  }
);

interface RadioCardGroupRootProps
  extends React.ComponentProps<typeof SubframeCore.RadioGroup.Root> {
  children?: React.ReactNode;
  className?: string;
}

const RadioCardGroupRoot = React.forwardRef<
  HTMLElement,
  RadioCardGroupRootProps
>(function RadioCardGroupRoot(
  { children, className, ...otherProps }: RadioCardGroupRootProps,
  ref
) {
  return children ? (
    <SubframeCore.RadioGroup.Root asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex items-start gap-2",
          className
        )}
        ref={ref as any}
      >
        {children}
      </div>
    </SubframeCore.RadioGroup.Root>
  ) : null;
});

export const RadioCardGroup = Object.assign(RadioCardGroupRoot, {
  RadioCard,
});
