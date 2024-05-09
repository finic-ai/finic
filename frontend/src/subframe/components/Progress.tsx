"use client";
/*
 * Documentation:
 * Progress — https://app.subframe.com/library?component=Progress_60964db0-a1bf-428b-b9d5-f34cdf58ea77
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface IndicatorProps
  extends React.ComponentProps<typeof SubframeCore.Progress.Indicator> {
  className?: string;
}

const Indicator = React.forwardRef<HTMLElement, IndicatorProps>(
  function Indicator({ className, ...otherProps }: IndicatorProps, ref) {
    return (
      <SubframeCore.Progress.Indicator asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex h-2 w-full flex-col items-start gap-2 rounded-full bg-brand-600",
            className
          )}
          ref={ref as any}
        />
      </SubframeCore.Progress.Indicator>
    );
  }
);

interface ProgressRootProps
  extends React.ComponentProps<typeof SubframeCore.Progress.Root> {
  value?: number;
  className?: string;
}

const ProgressRoot = React.forwardRef<HTMLElement, ProgressRootProps>(
  function ProgressRoot(
    { value = 30, className, ...otherProps }: ProgressRootProps,
    ref
  ) {
    return (
      <SubframeCore.Progress.Root asChild={true} value={value} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex w-full flex-col items-start gap-2 overflow-hidden rounded-full bg-neutral-200",
            className
          )}
          ref={ref as any}
        >
          <Indicator />
        </div>
      </SubframeCore.Progress.Root>
    );
  }
);

export const Progress = Object.assign(ProgressRoot, {
  Indicator,
});
