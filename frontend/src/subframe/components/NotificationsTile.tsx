"use client";
/*
 * Documentation:
 * NotificationsTile — https://app.subframe.com/library?component=NotificationsTile_a3bafc67-14c4-49d2-8212-9b7666d36dc3
 * Button — https://app.subframe.com/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Button } from "./Button";

interface NotificationsTileRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  hideViewAll?: boolean;
  className?: string;
}

const NotificationsTileRoot = React.forwardRef<
  HTMLElement,
  NotificationsTileRootProps
>(function NotificationsTileRoot(
  {
    children,
    hideViewAll = false,
    className,
    ...otherProps
  }: NotificationsTileRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/a3bafc67 flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background shadow-default",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex w-full items-start gap-2 pt-4 pr-3 pb-4 pl-6">
        <span className="line-clamp-1 w-full grow shrink-0 basis-0 text-subheader font-subheader text-default-font">
          Notifications
        </span>
        <Button
          className={SubframeCore.twClassNames({ hidden: hideViewAll })}
          variant="brand-tertiary"
          size="small"
          iconRight="FeatherChevronRight"
        >
          View all
        </Button>
      </div>
      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
      {children ? (
        <div className="flex w-full flex-col items-start gap-4 pt-6 pr-6 pb-6 pl-6">
          {children}
        </div>
      ) : null}
    </div>
  );
});

export const NotificationsTile = NotificationsTileRoot;
