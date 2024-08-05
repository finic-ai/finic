"use client";
/*
 * Documentation:
 * Properties Row — https://app.subframe.com/0bc1b5ae3457/library?component=Properties+Row_09e4ebd5-f53c-4b9a-8ef1-0a044ca4bdc4
 * Switch — https://app.subframe.com/0bc1b5ae3457/library?component=Switch_7a464794-9ea9-4040-b1de-5bfb2ce599d9
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface PropertiesRowRootProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

const PropertiesRowRoot = React.forwardRef<HTMLElement, PropertiesRowRootProps>(
  function PropertiesRowRoot(
    { text, children, className, ...otherProps }: PropertiesRowRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex w-full items-center border-b border-solid border-neutral-border bg-default-background pt-3 pr-4 pb-3 pl-4",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {text ? (
          <span className="grow shrink-0 basis-0 text-caption-bold font-caption-bold text-default-font">
            {text}
          </span>
        ) : null}
        {children ? (
          <div className="flex items-center justify-end">{children}</div>
        ) : null}
      </div>
    );
  }
);

export const PropertiesRow = PropertiesRowRoot;
