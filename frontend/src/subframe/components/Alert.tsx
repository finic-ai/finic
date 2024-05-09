"use client";
/*
 * Documentation:
 * Alert — https://app.subframe.com/library?component=Alert_3a65613d-d546-467c-80f4-aaba6a7edcd5
 * Icon Button — https://app.subframe.com/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface AlertRootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "brand" | "neutral" | "error" | "success" | "warning";
  icon?: SubframeCore.IconName;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

const AlertRoot = React.forwardRef<HTMLElement, AlertRootProps>(
  function AlertRoot(
    {
      variant = "neutral",
      icon = "FeatherInfo",
      title,
      description,
      actions,
      className,
      ...otherProps
    }: AlertRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/3a65613d flex w-full flex-col items-start gap-2 rounded border border-solid border-neutral-border bg-default-background pt-3 pr-3 pb-3 pl-4",
          {
            "border border-solid border-warning-200 bg-warning-100":
              variant === "warning",
            "border border-solid border-success-200 bg-success-100":
              variant === "success",
            "border border-solid border-error-200 bg-error-100":
              variant === "error",
            "border border-solid border-brand-200 bg-brand-100":
              variant === "brand",
          },
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex w-full items-center gap-4">
          <SubframeCore.Icon
            className={SubframeCore.twClassNames(
              "text-heading-3 font-heading-3 text-neutral-800",
              {
                "text-warning-800": variant === "warning",
                "text-success-800": variant === "success",
                "text-error-800": variant === "error",
                "text-brand-800": variant === "brand",
              }
            )}
            name={icon}
          />
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start">
            {title ? (
              <span
                className={SubframeCore.twClassNames(
                  "w-full whitespace-pre-wrap text-body-bold font-body-bold text-default-font",
                  {
                    "text-warning-800": variant === "warning",
                    "text-success-800": variant === "success",
                    "text-error-800": variant === "error",
                    "text-brand-800": variant === "brand",
                  }
                )}
              >
                {title}
              </span>
            ) : null}
            {description ? (
              <span
                className={SubframeCore.twClassNames(
                  "w-full whitespace-pre-wrap text-caption font-caption text-subtext-color",
                  {
                    "text-warning-800": variant === "warning",
                    "text-success-800": variant === "success",
                    "text-error-800": variant === "error",
                    "text-brand-800": variant === "brand",
                  }
                )}
              >
                {description}
              </span>
            ) : null}
          </div>
          {actions ? (
            <div className="flex items-center justify-end gap-1">{actions}</div>
          ) : null}
        </div>
      </div>
    );
  }
);

export const Alert = AlertRoot;
