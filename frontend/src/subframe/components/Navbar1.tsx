"use client";
/*
 * Documentation:
 * Navbar1 — https://app.subframe.com/library?component=Navbar1_2a04245c-ca48-46c6-a7ef-205a9b9d9ca7
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  children?: string;
  className?: string;
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  { selected = false, children, className, ...otherProps }: ItemProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/0df3a9ce flex cursor-pointer flex-col items-start gap-2 rounded-md pt-2 pr-3 pb-2 pl-3 hover:bg-neutral-50 active:bg-neutral-100",
        { "bg-neutral-50": selected },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {children ? (
        <span className="text-body-bold font-body-bold text-default-font">
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface Navbar1RootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  logo?: string;
  className?: string;
}

const Navbar1Root = React.forwardRef<HTMLElement, Navbar1RootProps>(
  function Navbar1Root(
    { children, logo, className, ...otherProps }: Navbar1RootProps,
    ref
  ) {
    return (
      <nav
        className={SubframeCore.twClassNames(
          "container max-w-none flex h-16 w-full flex-col items-start justify-center gap-2 border-b border-solid border-neutral-border bg-default-background",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex w-full items-center gap-4">
          {logo ? <img className="h-7 flex-none" src={logo} /> : null}
          {children ? (
            <div className="flex h-full w-full grow shrink-0 basis-0 items-center justify-end gap-1">
              {children}
            </div>
          ) : null}
        </div>
      </nav>
    );
  }
);

export const Navbar1 = Object.assign(Navbar1Root, {
  Item,
});
