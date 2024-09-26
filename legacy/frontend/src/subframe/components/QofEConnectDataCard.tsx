"use client";
/*
 * Documentation:
 * QofE Connect Data Card — https://app.subframe.com/cb0b7d209a24/library?component=QofE+Connect+Data+Card_fa2baf06-72f4-4f62-a9d6-19724c73966b
 * Copy to clipboard field — https://app.subframe.com/cb0b7d209a24/library?component=Copy+to+clipboard+field_1e2e1a38-8b4a-41bd-b224-b893c92a0495
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { CopyToClipboardField } from "./CopyToClipboardField";

interface QofEConnectDataCardRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  title?: string;
  subtitle?: string;
  icon2?: SubframeCore.IconName;
  className?: string;
}

const QofEConnectDataCardRoot = React.forwardRef<
  HTMLElement,
  QofEConnectDataCardRootProps
>(function QofEConnectDataCardRoot(
  {
    icon = "FeatherLink",
    title,
    subtitle,
    icon2 = "FeatherCheck",
    className,
    ...otherProps
  }: QofEConnectDataCardRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex h-60 flex-col items-start justify-between rounded-md border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full flex-col items-start">
          <div className="flex items-center gap-2">
            <SubframeCore.Icon
              className="text-subheader font-subheader text-default-font"
              name={icon}
            />
            {title ? (
              <span className="text-subheader font-subheader text-default-font">
                {title}
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <span className="text-body font-body text-subtext-color">
              {subtitle}
            </span>
          ) : null}
        </div>
        <CopyToClipboardField
          className="h-auto w-full flex-none"
          text="https://app.godealwise.com/?referral_code=7255e4f4-4fae-4865-9d17-bacbf3cf2426"
        />
      </div>
      <div className="flex h-10 w-full flex-none flex-col items-start gap-2">
        <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-300" />
        <div className="flex w-full grow shrink-0 basis-0 items-start justify-between">
          <span className="text-body-bold font-body-bold text-default-font">
            Status
          </span>
          <div className="flex items-center gap-1">
            <span className="text-body-bold font-body-bold text-brand-700">
              Connected
            </span>
            <SubframeCore.Icon
              className="text-body font-body text-brand-700"
              name="FeatherCheck"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export const QofEConnectDataCard = QofEConnectDataCardRoot;
