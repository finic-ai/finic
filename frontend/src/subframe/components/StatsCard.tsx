"use client";
/*
 * Documentation:
 * Stats Card — https://app.subframe.com/cb0b7d209a24/library?component=Stats+Card_ce8a575f-7dd0-409b-8e4d-98c260a65cb1
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface StatsCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  label?: string;
  value?: string;
  className?: string;
}

const StatsCardRoot = React.forwardRef<HTMLElement, StatsCardRootProps>(
  function StatsCardRoot(
    {
      icon = "FeatherDollarSign",
      label,
      value,
      className,
      ...otherProps
    }: StatsCardRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex w-full items-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background pt-4 pr-5 pb-4 pl-5 shadow-default",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
          <div className="flex w-full items-center gap-1">
            {label ? (
              <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-subtext-color">
                {label}
              </span>
            ) : null}
            <SubframeCore.Icon
              className="text-body-bold font-body-bold text-neutral-400"
              name={icon}
            />
          </div>
          {value ? (
            <span className="w-full text-section-header font-section-header text-brand-700">
              {value}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

export const StatsCard = StatsCardRoot;
