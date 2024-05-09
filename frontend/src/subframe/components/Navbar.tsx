"use client";
/*
 * Documentation:
 * Navbar — https://app.subframe.com/library?component=Navbar_6ca1b963-718d-4d67-aada-b3a747fd3661
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
        "group/bb245e2d flex cursor-pointer flex-col items-start gap-2 rounded pt-2 pr-3 pb-2 pl-3 hover:bg-neutral-50 active:bg-neutral-100",
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

interface NavbarRootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  logo?: string;
  className?: string;
}

const NavbarRoot = React.forwardRef<HTMLElement, NavbarRootProps>(
  function NavbarRoot(
    { children, logo, className, ...otherProps }: NavbarRootProps,
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
        <div className="flex items-center gap-4">
          {logo ? <img className="h-7 flex-none" src={logo} /> : null}
          {children ? (
            <div className="flex h-full w-full grow shrink-0 basis-0 items-start gap-1">
              {children}
            </div>
          ) : null}
        </div>
      </nav>
    );
  }
);

export const Navbar = Object.assign(NavbarRoot, {
  Item,
});
