"use client";
/*
 * Documentation:
 * Logo Icon — https://app.subframe.com/cb0b7d209a24/library?component=Logo+Icon_13f819c9-cdb5-4fb6-8634-13fd88ba5319
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface LogoIconRootProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "large" | "x-large";
  image?: string;
  className?: string;
}

const LogoIconRoot = React.forwardRef<HTMLElement, LogoIconRootProps>(
  function LogoIconRoot(
    { size = "default", image, className, ...otherProps }: LogoIconRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/13f819c9 flex h-5 w-5 flex-col items-center justify-center gap-2 rounded-full bg-neutral-50",
          { "h-9 w-9": size === "x-large", "h-7 w-7": size === "large" },
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {image ? (
          <img
            className={SubframeCore.twClassNames(
              "h-3 w-3 flex-none object-cover",
              {
                "h-5 w-5 flex-none": size === "x-large",
                "h-3.5 w-3.5 flex-none": size === "large",
              }
            )}
            src={image}
          />
        ) : null}
      </div>
    );
  }
);

export const LogoIcon = LogoIconRoot;
