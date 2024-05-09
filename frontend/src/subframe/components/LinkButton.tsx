"use client";
/*
 * Documentation:
 * Link Button — https://app.subframe.com/library?component=Link+Button_a4ee726a-774c-4091-8c49-55b659356024
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface LinkButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brand" | "neutral" | "inverse";
  size?: "large" | "medium" | "small";
  icon?: SubframeCore.IconName;
  children?: string;
  iconRight?: SubframeCore.IconName;
  className?: string;
}

const LinkButtonRoot = React.forwardRef<HTMLElement, LinkButtonRootProps>(
  function LinkButtonRoot(
    {
      variant = "neutral",
      size = "medium",
      icon = null,
      children,
      iconRight = null,
      className,
      type = "button",
      ...otherProps
    }: LinkButtonRootProps,
    ref
  ) {
    return (
      <button
        className={SubframeCore.twClassNames(
          "group/a4ee726a flex cursor-pointer items-center gap-1 border-none bg-transparent",
          { "flex-row gap-1": size === "large" },
          className
        )}
        ref={ref as any}
        type={type}
        {...otherProps}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-body font-body text-subtext-color group-hover/a4ee726a:text-subtext-color group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:text-neutral-400",
            {
              "text-caption font-caption": size === "small",
              "text-heading-3 font-heading-3": size === "large",
              "text-white group-hover/a4ee726a:text-white":
                variant === "inverse",
              "text-brand-700 group-hover/a4ee726a:text-brand-700":
                variant === "brand",
            }
          )}
          name={icon}
        />
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "text-body font-body text-subtext-color group-hover/a4ee726a:text-subtext-color group-hover/a4ee726a:underline group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:no-underline",
              {
                "text-caption font-caption": size === "small",
                "text-heading-3 font-heading-3": size === "large",
                "text-white group-hover/a4ee726a:text-white":
                  variant === "inverse",
                "text-brand-700 group-hover/a4ee726a:text-brand-700":
                  variant === "brand",
              }
            )}
          >
            {children}
          </span>
        ) : null}
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-body font-body text-subtext-color group-hover/a4ee726a:text-subtext-color group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:text-neutral-400",
            {
              "text-caption font-caption": size === "small",
              "text-heading-3 font-heading-3": size === "large",
              "text-white group-hover/a4ee726a:text-white":
                variant === "inverse",
              "text-brand-700 group-hover/a4ee726a:text-brand-700":
                variant === "brand",
            }
          )}
          name={iconRight}
        />
      </button>
    );
  }
);

export const LinkButton = LinkButtonRoot;
