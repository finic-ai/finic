"use client";
/*
 * Documentation:
 * Icon Button — https://app.subframe.com/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
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
          "group/af9405b1 flex h-8 w-8 cursor-pointer items-center justify-center gap-2 rounded border-none bg-transparent hover:bg-neutral-50 active:bg-neutral-100 disabled:cursor-default disabled:bg-neutral-200 hover:disabled:cursor-default hover:disabled:bg-neutral-200 active:disabled:cursor-default active:disabled:bg-neutral-200",
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
            "border border-solid border-neutral-border bg-default-background hover:bg-neutral-50 active:bg-neutral-100":
              variant === "neutral-secondary",
            "bg-neutral-600 hover:bg-neutral-500 active:bg-neutral-600":
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
            "text-[18px] font-[500] leading-[18px] text-neutral-600 group-disabled/af9405b1:text-neutral-400",
            {
              hidden: loading,
              "text-[14px] font-[400] leading-[14px]": size === "small",
              "text-[20px] font-[500] leading-[20px]": size === "large",
              "text-white group-hover/af9405b1:text-white":
                variant === "inverse",
              "text-error-700 group-hover/af9405b1:text-error-700 group-active/af9405b1:text-error-700":
                variant === "destructive-tertiary" ||
                variant === "destructive-secondary",
              "text-white group-hover/af9405b1:text-white group-active/af9405b1:text-white":
                variant === "destructive-primary" ||
                variant === "neutral-primary" ||
                variant === "brand-primary",
              "text-brand-700 group-hover/af9405b1:text-brand-700 group-active/af9405b1:text-brand-700":
                variant === "brand-tertiary" || variant === "brand-secondary",
            }
          )}
          name={icon}
        />
        <SubframeCore.Loader
          className={SubframeCore.twClassNames(
            "hidden text-[16px] font-[400] leading-[16px] text-neutral-500 group-disabled/af9405b1:text-neutral-400",
            {
              "inline-block text-brand-700": loading,
              "text-[16px] font-[400] leading-[16px]": size === "small",
              "text-brand-600":
                variant === "brand-tertiary" || variant === "brand-secondary",
            }
          )}
        />
      </button>
    );
  }
);

export const IconButton = IconButtonRoot;
