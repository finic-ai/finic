"use client";
/*
 * Documentation:
 * Detail Card — https://app.subframe.com/library?component=Detail+Card_7b4c33d9-098f-461c-a804-7905f589dc59
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface DetailCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  value?: string;
  small?: boolean;
  className?: string;
}

const DetailCardRoot = React.forwardRef<HTMLElement, DetailCardRootProps>(
  function DetailCardRoot(
    {
      label,
      value,
      small = false,
      className,
      ...otherProps
    }: DetailCardRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/7b4c33d9 flex w-full min-w-[160px] items-start gap-3 pr-4",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
          {label ? (
            <span
              className={SubframeCore.twClassNames(
                "line-clamp-1 w-full text-label-bold font-label-bold text-subtext-color",
                { "text-label font-label": small }
              )}
            >
              {label}
            </span>
          ) : null}
          {value ? (
            <span
              className={SubframeCore.twClassNames(
                "w-full text-subheader font-subheader text-brand-700",
                { "text-body-bold font-body-bold text-brand-700": small }
              )}
            >
              {value}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

export const DetailCard = DetailCardRoot;
