"use client";
/*
 * Documentation:
 * Copy to clipboard field — https://app.subframe.com/cb0b7d209a24/library?component=Copy+to+clipboard+field_1e2e1a38-8b4a-41bd-b224-b893c92a0495
 * Copy to clipboard button — https://app.subframe.com/cb0b7d209a24/library?component=Copy+to+clipboard+button_e8c76626-6462-4f2f-b595-38d530d427e8
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { CopyToClipboardButton } from "./CopyToClipboardButton";

interface CopyToClipboardFieldRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  className?: string;
}

const CopyToClipboardFieldRoot = React.forwardRef<
  HTMLElement,
  CopyToClipboardFieldRootProps
>(function CopyToClipboardFieldRoot(
  { text, className, ...otherProps }: CopyToClipboardFieldRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex items-start gap-1.5 rounded-md border border-solid border-neutral-border bg-neutral-50 pt-0.5 pr-0.5 pb-0.5 pl-2",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex grow shrink-0 basis-0 items-start gap-1 pt-0.5 pb-0.5">
        {text ? (
          <span className="grow shrink-0 basis-0 whitespace-pre-wrap text-monospace-body font-monospace-body text-subtext-color">
            {text}
          </span>
        ) : null}
      </div>
      <CopyToClipboardButton
        clipboardText={text}
        tooltipText="Copy to clipboard"
      />
    </div>
  );
});

export const CopyToClipboardField = CopyToClipboardFieldRoot;
