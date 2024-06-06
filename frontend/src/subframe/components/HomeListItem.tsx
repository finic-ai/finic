"use client";
/*
 * Documentation:
 * Home List Item — https://app.subframe.com/library?component=Home+List+Item_ebb36ea3-fbec-433a-9b2b-1ba94ab49667
 * Dropdown Menu — https://app.subframe.com/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 * Icon Button — https://app.subframe.com/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { DropdownMenu } from "./DropdownMenu";

interface HomeListItemRootProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  title?: string;
  subtitle?: string;
  metadata?: string;
  children?: React.ReactNode;
  className?: string;
}

const HomeListItemRoot = React.forwardRef<HTMLElement, HomeListItemRootProps>(
  function HomeListItemRoot(
    {
      icon = "FeatherBarChart3",
      title,
      subtitle,
      metadata,
      children,
      className,
      ...otherProps
    }: HomeListItemRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/ebb36ea3 flex w-full cursor-pointer items-center gap-4 rounded-md pt-2 pr-2 pb-2 pl-2 hover:bg-neutral-50",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex items-center gap-2 pt-1 pr-1 pb-1 pl-1">
          <SubframeCore.Icon
            className="text-[24px] font-[500] leading-[24px] text-brand-700"
            name={icon}
          />
        </div>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start">
          {title ? (
            <span className="line-clamp-1 w-full text-body font-body text-default-font">
              {title}
            </span>
          ) : null}
          {subtitle ? (
            <span className="w-full text-label font-label text-subtext-color">
              {subtitle}
            </span>
          ) : null}
        </div>
        {metadata ? (
          <span className="w-full grow shrink-0 basis-0 text-body font-body text-subtext-color">
            {metadata}
          </span>
        ) : null}
        {children ? (
          <div className="flex items-center justify-end gap-2">{children}</div>
        ) : null}
      </div>
    );
  }
);

export const HomeListItem = HomeListItemRoot;
