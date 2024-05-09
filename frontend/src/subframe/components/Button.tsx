"use client";
/*
 * Documentation:
 * Button — https://app.subframe.com/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ButtonRootProps
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
  children?: string;
  icon?: SubframeCore.IconName;
  iconRight?: SubframeCore.IconName;
  loading?: boolean;
  className?: string;
}

const ButtonRoot = React.forwardRef<HTMLElement, ButtonRootProps>(
  function ButtonRoot(
    {
      variant = "brand-primary",
      size = "medium",
      children,
      icon = null,
      iconRight = null,
      loading = false,
      className,
      type = "button",
      ...otherProps
    }: ButtonRootProps,
    ref
  ) {
    return (
      <button
        className={SubframeCore.twClassNames(
          "group/3b777358 flex h-8 cursor-pointer items-center justify-center gap-2 rounded border-none bg-brand-600 pr-3 pl-3 hover:bg-brand-500 active:bg-brand-600 disabled:cursor-default disabled:bg-neutral-200 hover:disabled:cursor-default hover:disabled:bg-neutral-200 active:disabled:cursor-default active:disabled:bg-neutral-200",
          {
            "h-6 w-auto flex-row gap-1 pt-0 pr-2 pb-0 pl-2": size === "small",
            "h-10 w-auto pt-0 pr-4 pb-0 pl-4": size === "large",
            "bg-transparent hover:bg-[#ffffff29] active:bg-[#ffffff3d]":
              variant === "inverse",
            "bg-transparent hover:bg-error-50 active:bg-error-100":
              variant === "destructive-tertiary",
            "bg-error-50 hover:bg-error-100 active:bg-error-50":
              variant === "destructive-secondary",
            "bg-error-600 hover:bg-error-500 active:bg-error-600":
              variant === "destructive-primary",
            "bg-transparent hover:bg-neutral-50 active:bg-neutral-100":
              variant === "neutral-tertiary",
            "border border-solid border-neutral-border bg-default-background hover:bg-neutral-50 active:bg-default-background":
              variant === "neutral-secondary",
            "bg-neutral-600 hover:bg-neutral-500 active:bg-neutral-600":
              variant === "neutral-primary",
            "bg-transparent hover:bg-brand-50 active:bg-brand-100":
              variant === "brand-tertiary",
            "bg-brand-50 hover:bg-brand-100 active:bg-brand-50":
              variant === "brand-secondary",
          },
          className
        )}
        ref={ref as any}
        type={type}
        {...otherProps}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-[16px] font-[400] leading-[16px] text-white group-disabled/3b777358:text-neutral-400 group-hover/3b777358:group-disabled/3b777358:text-neutral-400 group-active/3b777358:group-disabled/3b777358:text-neutral-400",
            {
              hidden: loading,
              "text-[12px] font-[400] leading-[12px]": size === "small",
              "text-[18px] font-[400] leading-[18px]": size === "large",
              "text-white": variant === "inverse",
              "text-error-700":
                variant === "destructive-tertiary" ||
                variant === "destructive-secondary",
              "text-neutral-600":
                variant === "neutral-tertiary" ||
                variant === "neutral-secondary",
              "text-brand-700":
                variant === "brand-tertiary" || variant === "brand-secondary",
            }
          )}
          name={icon}
        />
        <div
          className={SubframeCore.twClassNames(
            "hidden h-4 w-4 flex-none items-center justify-center gap-2",
            { flex: loading, "h-3 w-3 flex-none": size === "small" }
          )}
        >
          <SubframeCore.Loader
            className={SubframeCore.twClassNames(
              "text-body font-body text-white group-disabled/3b777358:text-neutral-400",
              {
                "inline-block text-[12px] font-[400] leading-[20px]": loading,
                "text-caption font-caption": size === "small",
                "text-error-800":
                  variant === "destructive-tertiary" ||
                  variant === "destructive-secondary",
                "text-neutral-700":
                  variant === "neutral-tertiary" ||
                  variant === "neutral-secondary",
                "text-brand-700":
                  variant === "brand-tertiary" || variant === "brand-secondary",
              }
            )}
          />
        </div>
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "whitespace-nowrap text-body-bold font-body-bold text-white group-disabled/3b777358:text-neutral-400",
              {
                "text-caption-bold font-caption-bold": size === "small",
                "text-white": variant === "inverse",
                "text-error-700":
                  variant === "destructive-tertiary" ||
                  variant === "destructive-secondary",
                "text-neutral-600":
                  variant === "neutral-tertiary" ||
                  variant === "neutral-secondary",
                "text-brand-700":
                  variant === "brand-tertiary" || variant === "brand-secondary",
              }
            )}
          >
            {children}
          </span>
        ) : null}
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-[16px] font-[400] leading-[16px] text-white group-disabled/3b777358:text-neutral-400",
            {
              "text-[12px] font-[600] leading-[12px]": size === "small",
              "text-[18px] font-[400] leading-[18px]": size === "large",
              "text-white": variant === "inverse",
              "text-error-700":
                variant === "destructive-tertiary" ||
                variant === "destructive-secondary",
              "text-neutral-600":
                variant === "neutral-tertiary" ||
                variant === "neutral-secondary",
              "text-brand-700":
                variant === "brand-tertiary" || variant === "brand-secondary",
            }
          )}
          name={iconRight}
        />
      </button>
    );
  }
);

export const Button = ButtonRoot;
