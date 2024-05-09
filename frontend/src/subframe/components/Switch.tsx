"use client";
/*
 * Documentation:
 * Switch — https://app.subframe.com/library?component=Switch_7a464794-9ea9-4040-b1de-5bfb2ce599d9
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ThumbProps
  extends React.ComponentProps<typeof SubframeCore.Switch.Thumb> {
  className?: string;
}

const Thumb = React.forwardRef<HTMLElement, ThumbProps>(function Thumb(
  { className, ...otherProps }: ThumbProps,
  ref
) {
  return (
    <SubframeCore.Switch.Thumb asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex h-3.5 w-3.5 flex-col items-start gap-2 rounded-full bg-white shadow-[0px_1px_2px_0px_#0000001a]",
          className
        )}
        ref={ref as any}
      />
    </SubframeCore.Switch.Thumb>
  );
});

interface SwitchRootProps
  extends React.ComponentProps<typeof SubframeCore.Switch.Root> {
  className?: string;
}

const SwitchRoot = React.forwardRef<HTMLElement, SwitchRootProps>(
  function SwitchRoot({ className, ...otherProps }: SwitchRootProps, ref) {
    return (
      <SubframeCore.Switch.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "group/7a464794 flex h-5 w-8 cursor-pointer flex-col items-start justify-center gap-2 rounded-full border border-solid border-neutral-300 bg-neutral-300 pt-0.5 pr-0.5 pb-0.5 pl-0.5 aria-[checked=true]:border aria-[checked=true]:border-solid aria-[checked=true]:border-brand-600 aria-[checked=true]:bg-brand-600",
            className
          )}
          ref={ref as any}
        >
          <Thumb />
        </div>
      </SubframeCore.Switch.Root>
    );
  }
);

export const Switch = Object.assign(SwitchRoot, {
  Thumb,
});
