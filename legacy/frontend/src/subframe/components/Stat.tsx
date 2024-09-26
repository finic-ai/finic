"use client";
/*
 * Documentation:
 * Stat — https://app.subframe.com/cb0b7d209a24/library?component=Stat_87f41252-6499-4a06-b300-478b0eb95ef4
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface StatRootProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  value?: string;
  className?: string;
}

const StatRoot = React.forwardRef<HTMLElement, StatRootProps>(function StatRoot(
  { label, value, className, ...otherProps }: StatRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex w-full items-start gap-3 rounded-md border border-solid border-neutral-border bg-default-background pt-4 pr-4 pb-4 pl-4 shadow-default",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
        {label ? (
          <span className="line-clamp-1 w-full text-body font-body text-neutral-600">
            {label}
          </span>
        ) : null}
        {value ? (
          <span className="w-full text-section-header font-section-header text-brand-700">
            {value}
          </span>
        ) : null}
      </div>
    </div>
  );
});

export const Stat = StatRoot;
