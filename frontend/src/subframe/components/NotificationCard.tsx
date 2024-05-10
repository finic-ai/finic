"use client";
/*
 * Documentation:
 * NotificationCard — https://app.subframe.com/library?component=NotificationCard_111b2a02-05f4-409e-9687-998a4b3814db
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface NotificationCardRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  text?: string;
  text2?: string;
  className?: string;
}

const NotificationCardRoot = React.forwardRef<
  HTMLElement,
  NotificationCardRootProps
>(function NotificationCardRoot(
  {
    icon = "FeatherUsers",
    text,
    text2,
    className,
    ...otherProps
  }: NotificationCardRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex w-full items-center gap-4 rounded-md bg-brand-50 pt-4 pr-4 pb-4 pl-4",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex items-center justify-center pt-2 pr-2 pb-2 pl-2">
        <SubframeCore.Icon
          className="text-subheader font-subheader text-brand-700"
          name={icon}
        />
      </div>
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
        {text ? (
          <span className="w-full text-body-bold font-body-bold text-default-font">
            {text}
          </span>
        ) : null}
        {text2 ? (
          <span className="h-full grow shrink-0 basis-0 text-label font-label text-subtext-color">
            {text2}
          </span>
        ) : null}
      </div>
    </div>
  );
});

export const NotificationCard = NotificationCardRoot;
