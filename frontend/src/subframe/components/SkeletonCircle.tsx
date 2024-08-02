"use client";
/*
 * Documentation:
 * Skeleton Circle — https://app.subframe.com/library?component=Skeleton+Circle_8b6e7a84-358f-4dc5-9de8-792a18fa9955
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface SkeletonCircleRootProps
  extends React.ComponentProps<typeof SubframeCore.Skeleton> {
  size?: "default" | "small" | "x-small";
  className?: string;
}

const SkeletonCircleRoot = React.forwardRef<
  HTMLElement,
  SkeletonCircleRootProps
>(function SkeletonCircleRoot(
  { size = "default", className, ...otherProps }: SkeletonCircleRootProps,
  ref
) {
  return (
    <SubframeCore.Skeleton
      className={SubframeCore.twClassNames(
        "group/8b6e7a84 flex h-9 w-9 flex-col items-start gap-2 rounded-full bg-neutral-200",
        { "h-5 w-5": size === "x-small", "h-7 w-7": size === "small" },
        className
      )}
      ref={ref as any}
      {...otherProps}
    />
  );
});

export const SkeletonCircle = SkeletonCircleRoot;
