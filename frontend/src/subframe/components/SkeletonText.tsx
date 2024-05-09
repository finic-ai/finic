"use client";
/*
 * Documentation:
 * Skeleton Text — https://app.subframe.com/library?component=Skeleton+Text_a9aae3f0-955e-4607-a272-374f1dc18f4b
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface SkeletonTextRootProps
  extends React.ComponentProps<typeof SubframeCore.Skeleton> {
  size?: "default" | "label" | "subheader" | "section-header" | "header";
  className?: string;
}

const SkeletonTextRoot = React.forwardRef<HTMLElement, SkeletonTextRootProps>(
  function SkeletonTextRoot(
    { size = "default", className, ...otherProps }: SkeletonTextRootProps,
    ref
  ) {
    return (
      <SubframeCore.Skeleton
        className={SubframeCore.twClassNames(
          "group/a9aae3f0 flex h-5 w-full flex-col items-start gap-2 rounded bg-neutral-200",
          {
            "h-10 w-full": size === "header",
            "h-9 w-full": size === "section-header",
            "h-7 w-full": size === "subheader",
            "h-4 w-full": size === "label",
          },
          className
        )}
        ref={ref as any}
        {...otherProps}
      />
    );
  }
);

export const SkeletonText = SkeletonTextRoot;
