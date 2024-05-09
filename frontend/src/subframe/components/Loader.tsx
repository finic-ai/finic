"use client";
/*
 * Documentation:
 * Loader — https://app.subframe.com/library?component=Loader_f2e570c8-e463-45c2-aae9-a960146bc5d5
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
            "text-heading-2 font-heading-2": size === "large",
            "text-caption font-caption": size === "small",
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
