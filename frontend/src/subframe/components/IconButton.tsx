"use client";
/*
 * Documentation:
 * Icon Button — https://app.subframe.com/cb0b7d209a24/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface IconButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "brand-primary"
    | "brand-secondary"
    | "brand-tertiary"
    | "neutral-primary"
    | "neutral-secondary"
    | "neutral-tertiary"
    | "destructive-primary"
    | "destructive-secondary"
    | "destructive-tertiary"
    | "inverse";
  size?: "large" | "medium" | "small";
  icon?: SubframeCore.IconName;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const IconButtonRoot = React.forwardRef<HTMLElement, IconButtonRootProps>(
  function IconButtonRoot(
    {
      variant = "neutral-tertiary",
      size = "medium",
      icon = "FeatherPlus",
      loading = false,
      className,
      type = "button",
      ...otherProps
    }: IconButtonRootProps,
    ref
  ) {
    return (
      <button
        className={SubframeCore.twClassNames(
          "group/af9405b1 flex h-8 w-8 cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-transparent hover:bg-neutral-100 active:bg-neutral-50 disabled:cursor-default disabled:bg-neutral-100 hover:disabled:cursor-default hover:disabled:bg-neutral-100 active:disabled:cursor-default active:disabled:bg-neutral-100",
          {
            "h-6 w-6": size === "small",
            "h-10 w-10": size === "large",
            "hover:bg-[#ffffff29] active:bg-[#ffffff3d]": variant === "inverse",
            "hover:bg-error-50 active:bg-error-100":
              variant === "destructive-tertiary",
            "bg-error-50 hover:bg-error-100 active:bg-error-50":
              variant === "destructive-secondary",
            "bg-error-600 hover:bg-error-500 active:bg-error-600":
              variant === "destructive-primary",
            "border border-solid border-neutral-border bg-white hover:bg-neutral-100 active:bg-white":
              variant === "neutral-secondary",
            "bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-100":
              variant === "neutral-primary",
            "hover:bg-brand-50 active:bg-brand-100":
              variant === "brand-tertiary",
            "bg-brand-50 hover:bg-brand-100 active:bg-brand-50":
              variant === "brand-secondary",
            "bg-brand-600 hover:bg-brand-500 active:bg-brand-600":
              variant === "brand-primary",
          },
          className
        )}
        ref={ref as any}
        type={type}
        {...otherProps}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-subheader font-subheader text-neutral-700 group-disabled/af9405b1:text-neutral-400",
            {
              hidden: loading,
              "text-body font-body": size === "small",
              "text-subheader font-subheader": size === "large",
              "text-white group-hover/af9405b1:text-white":
                variant === "inverse",
              "text-error-700 group-hover/af9405b1:text-error-700 group-active/af9405b1:text-error-700":
                variant === "destructive-tertiary" ||
                variant === "destructive-secondary",
              "text-white group-hover/af9405b1:text-white group-active/af9405b1:text-white":
                variant === "destructive-primary" ||
                variant === "brand-primary",
              "text-neutral-700": variant === "neutral-secondary",
              "text-neutral-700 group-hover/af9405b1:text-neutral-700 group-active/af9405b1:text-neutral-700":
                variant === "neutral-primary",
              "text-brand-700 group-hover/af9405b1:text-brand-700 group-active/af9405b1:text-brand-700":
                variant === "brand-tertiary" || variant === "brand-secondary",
            }
          )}
          name={icon}
        />
        <SubframeCore.Loader
          className={SubframeCore.twClassNames(
            "hidden text-label font-label text-neutral-700 group-disabled/af9405b1:text-neutral-400",
            {
              "inline-block": loading,
              "text-label font-label": size === "small",
              "text-white":
                variant === "inverse" ||
                variant === "destructive-primary" ||
                variant === "brand-primary",
              "text-error-700":
                variant === "destructive-tertiary" ||
                variant === "destructive-secondary",
              "text-neutral-700": variant === "neutral-primary",
              "text-brand-700":
                variant === "brand-tertiary" || variant === "brand-secondary",
            }
          )}
        />
      </button>
    );
  }
);

export const IconButton = IconButtonRoot;
