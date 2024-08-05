"use client";
/*
 * Documentation:
 * Alert — https://app.subframe.com/cb0b7d209a24/library?component=Alert_3a65613d-d546-467c-80f4-aaba6a7edcd5
 * Icon Button — https://app.subframe.com/cb0b7d209a24/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
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
          "group/3a65613d flex w-full flex-col items-start gap-2 rounded-md border border-solid border-neutral-200 bg-neutral-50 pt-3 pr-3 pb-3 pl-4",
          {
            "border border-solid border-warning-100 bg-warning-50":
              variant === "warning",
            "border border-solid border-success-100 bg-success-50":
              variant === "success",
            "border border-solid border-error-100 bg-error-50":
              variant === "error",
            "border border-solid border-brand-100 bg-brand-50":
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
              "text-subheader font-subheader text-neutral-800",
              {
                "text-warning-800": variant === "warning",
                "text-success-800": variant === "success",
                "text-error-800": variant === "error",
                "text-brand-800": variant === "brand",
              }
            )}
            name={icon}
          />
          <div className="flex grow shrink-0 basis-0 flex-col items-start">
            {title ? (
              <span
                className={SubframeCore.twClassNames(
                  "w-full whitespace-pre-wrap text-body-bold font-body-bold text-default-font",
                  {
                    "text-warning-900": variant === "warning",
                    "text-success-900": variant === "success",
                    "text-error-900": variant === "error",
                    "text-brand-900": variant === "brand",
                  }
                )}
              >
                {title}
              </span>
            ) : null}
            {description ? (
              <span
                className={SubframeCore.twClassNames(
                  "w-full whitespace-pre-wrap text-label font-label text-subtext-color",
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
