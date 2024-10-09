"use client";
/*
 * Documentation:
 * App Nav Button — https://app.subframe.com/0bc1b5ae3457/library?component=App+Nav+Button_14ac281b-a86a-4832-a1a2-bc4e56e90242
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface AppNavButtonRootProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  selected?: boolean;
  className?: string;
}

const AppNavButtonRoot = React.forwardRef<HTMLElement, AppNavButtonRootProps>(
  function AppNavButtonRoot(
    { text, selected = false, className, ...otherProps }: AppNavButtonRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/14ac281b flex h-12 cursor-pointer flex-col items-center justify-center gap-4 px-4",
          { "border-b border-solid border-brand-700": selected },
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {text ? (
          <span
            className={SubframeCore.twClassNames(
              "text-body-bold font-body-bold text-subtext-color group-hover/14ac281b:text-default-font",
              { "text-brand-700": selected }
            )}
          >
            {text}
          </span>
        ) : null}
      </div>
    );
  }
);

export const AppNavButton = AppNavButtonRoot;
