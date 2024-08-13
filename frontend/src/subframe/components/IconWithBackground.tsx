"use client";
/*
 * Documentation:
 * Icon with background — https://app.subframe.com/cb0b7d209a24/library?component=Icon+with+background_c5d68c0e-4c0c-4cff-8d8c-6ff334859b3a
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface IconWithBackgroundRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "brand" | "neutral" | "error" | "success" | "warning";
  size?: "x-large" | "large" | "medium" | "small" | "x-small";
  icon?: SubframeCore.IconName;
  square?: boolean;
  className?: string;
}

export type IconName = SubframeCore.IconName

const IconWithBackgroundRoot = React.forwardRef<
  HTMLElement,
  IconWithBackgroundRootProps
>(function IconWithBackgroundRoot(
  {
    variant = "brand",
    size = "x-small",
    icon = "FeatherCheck",
    square = false,
    className,
    ...otherProps
  }: IconWithBackgroundRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/c5d68c0e flex h-5 w-5 items-center justify-center gap-2 rounded-full bg-brand-100",
        {
          "rounded-md": square,
          "h-6 w-6": size === "small",
          "h-8 w-8": size === "medium",
          "h-12 w-12": size === "large",
          "h-16 w-16": size === "x-large",
          "bg-warning-100": variant === "warning",
          "bg-success-100": variant === "success",
          "bg-error-100": variant === "error",
          "bg-neutral-100": variant === "neutral",
        },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <SubframeCore.Icon
        className={SubframeCore.twClassNames(
          "text-[10px] font-[400] leading-[12px] text-brand-800",
          {
            "text-label font-label": size === "small",
            "text-body font-body": size === "medium",
            "text-section-header font-section-header": size === "large",
            "text-header font-header": size === "x-large",
            "text-warning-800": variant === "warning",
            "text-success-800": variant === "success",
            "text-error-800": variant === "error",
            "text-neutral-700": variant === "neutral",
          }
        )}
        name={icon}
      />
    </div>
  );
});

export const IconWithBackground = IconWithBackgroundRoot;
