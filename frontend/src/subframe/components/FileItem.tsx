"use client";
/*
 * Documentation:
 * File Item — https://app.subframe.com/library?component=File+Item_061250c5-6a6d-44d0-90b4-6e72e890895a
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface FileItemRootProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  name?: string;
  imagePreview?: React.ReactNode;
  className?: string;
}

const FileItemRoot = React.forwardRef<HTMLElement, FileItemRootProps>(
  function FileItemRoot(
    {
      selected = false,
      name,
      imagePreview,
      className,
      ...otherProps
    }: FileItemRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/061250c5 flex cursor-pointer flex-col items-start gap-2 rounded-md",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {imagePreview ? (
          <div
            className={SubframeCore.twClassNames(
              "flex flex-col items-start gap-2 rounded-md border-2 border-solid border-neutral-border group-hover/061250c5:border-2 group-hover/061250c5:border-solid group-hover/061250c5:border-neutral-300",
              { "border-2 border-solid border-brand-600": selected }
            )}
          >
            {imagePreview}
          </div>
        ) : null}
        {name ? (
          <span
            className={SubframeCore.twClassNames(
              "text-body font-body text-default-font",
              { "text-body-bold font-body-bold": selected }
            )}
          >
            {name}
          </span>
        ) : null}
      </div>
    );
  }
);

export const FileItem = FileItemRoot;
