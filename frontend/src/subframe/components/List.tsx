"use client";
/*
 * Documentation:
 * List — https://app.subframe.com/cb0b7d209a24/library?component=List_414641ff-6f21-4e4e-81b4-170160998f40
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  leftSlot?: React.ReactNode;
  children?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}

const ListItem = React.forwardRef<HTMLElement, ListItemProps>(function ListItem(
  { leftSlot, children, rightSlot, className, ...otherProps }: ListItemProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/b47949b5 flex w-full cursor-pointer items-center gap-4 border-b border-solid border-neutral-border pt-4 pr-4 pb-4 pl-4 hover:bg-neutral-50 active:bg-neutral-100",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {leftSlot ? (
        <div className="flex items-start gap-2">{leftSlot}</div>
      ) : null}
      {children ? (
        <div className="flex grow shrink-0 basis-0 flex-col items-start">
          {children}
        </div>
      ) : null}
      {rightSlot ? (
        <div className="flex items-center justify-end gap-4">{rightSlot}</div>
      ) : null}
    </div>
  );
});

interface ListRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ListRoot = React.forwardRef<HTMLElement, ListRootProps>(function ListRoot(
  { children, className, ...otherProps }: ListRootProps,
  ref
) {
  return children ? (
    <div
      className={SubframeCore.twClassNames(
        "flex h-full w-full flex-col items-start",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {children}
    </div>
  ) : null;
});

export const List = Object.assign(ListRoot, {
  ListItem,
});
