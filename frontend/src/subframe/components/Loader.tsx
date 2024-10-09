"use client";
/*
 * Documentation:
 * Loader — https://app.subframe.com/cb0b7d209a24/library?component=Loader_f2e570c8-e463-45c2-aae9-a960146bc5d5
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface LoaderRootProps
  extends React.ComponentProps<typeof SubframeCore.Loader> {
  size?: "small" | "medium" | "large";
  className?: string;
}

const LoaderRoot = React.forwardRef<HTMLElement, LoaderRootProps>(
  function LoaderRoot(
    { size = "medium", className, ...otherProps }: LoaderRootProps,
    ref
  ) {
    return (
      <SubframeCore.Loader
        className={SubframeCore.twClassNames(
          "group/f2e570c8 text-body font-body text-brand-600",
          {
            "text-section-header font-section-header": size === "large",
            "text-label font-label": size === "small",
          },
          className
        )}
        ref={ref as any}
        {...otherProps}
      />
    );
  }
);

export const Loader = LoaderRoot;
