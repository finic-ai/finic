"use client";
/*
 * Documentation:
 * Badge — https://app.subframe.com/cb0b7d209a24/library?component=Badge_97bdb082-1124-4dd7-a335-b14b822d0157
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface BadgeRootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "brand" | "neutral" | "error" | "warning" | "success";
  icon?: SubframeCore.IconName;
  children?: string;
  iconRight?: SubframeCore.IconName;
  className?: string;
}

const BadgeRoot = React.forwardRef<HTMLElement, BadgeRootProps>(
  function BadgeRoot(
    {
      variant = "brand",
      icon = null,
      children,
      iconRight = null,
      className,
      ...otherProps
    }: BadgeRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/97bdb082 flex h-6 items-center gap-1 rounded-md border border-solid border-brand-100 bg-brand-100 pr-2 pl-2",
          {
            "border border-solid border-success-100 bg-success-100":
              variant === "success",
            "border border-solid border-warning-100 bg-warning-100":
              variant === "warning",
            "border border-solid border-error-100 bg-error-100":
              variant === "error",
            "border border-solid border-neutral-100 bg-neutral-100":
              variant === "neutral",
          },
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-label font-label text-brand-700",
            {
              "text-success-800": variant === "success",
              "text-warning-800": variant === "warning",
              "text-error-700": variant === "error",
              "text-neutral-700": variant === "neutral",
            }
          )}
          name={icon}
        />
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "whitespace-nowrap text-label font-label text-brand-800",
              {
                "text-success-800": variant === "success",
                "text-warning-800": variant === "warning",
                "text-error-800": variant === "error",
                "text-neutral-700": variant === "neutral",
              }
            )}
          >
            {children}
          </span>
        ) : null}
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-label font-label text-brand-700",
            {
              "text-success-800": variant === "success",
              "text-warning-800": variant === "warning",
              "text-error-700": variant === "error",
              "text-neutral-700": variant === "neutral",
            }
          )}
          name={iconRight}
        />
      </div>
    );
  }
);

export const Badge = BadgeRoot;
