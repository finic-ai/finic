"use client";
/*
 * Documentation:
 * Email Row — https://app.subframe.com/cb0b7d209a24/library?component=Email+Row_409e2e8c-9725-4f71-82d5-3bfa3dc3bdef
 * Icon Button — https://app.subframe.com/cb0b7d209a24/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { IconButton } from "./IconButton";

interface EmailRowRootProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  emailPreview?: string;
  className?: string;
}

const EmailRowRoot = React.forwardRef<HTMLElement, EmailRowRootProps>(
  function EmailRowRoot(
    { name, emailPreview, className, ...otherProps }: EmailRowRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex w-full items-center gap-6 pt-2 pr-2 pb-2 pl-2",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {name ? (
          <span className="line-clamp-1 max-w-[240px] grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
            {name}
          </span>
        ) : null}
        {emailPreview ? (
          <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-subtext-color">
            {emailPreview}
          </span>
        ) : null}
        <IconButton size="medium" icon="FeatherMoreHorizontal" />
      </div>
    );
  }
);

export const EmailRow = EmailRowRoot;
