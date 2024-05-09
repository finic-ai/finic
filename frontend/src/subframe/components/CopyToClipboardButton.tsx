"use client";
/*
 * Documentation:
 * Copy to clipboard button — https://app.subframe.com/library?component=Copy+to+clipboard+button_e8c76626-6462-4f2f-b595-38d530d427e8
 * Tooltip — https://app.subframe.com/library?component=Tooltip_ccebd1e9-f6ac-4737-8376-0dfacd90c9f3
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Tooltip } from "./Tooltip";

interface CopyToClipboardButtonRootProps
  extends React.ComponentProps<typeof SubframeCore.CopyToClipboard.Root> {
  clipboardText?: string;
  tooltipText?: string;
  icon?: SubframeCore.IconName;
  className?: string;
}

const CopyToClipboardButtonRoot = React.forwardRef<
  HTMLElement,
  CopyToClipboardButtonRootProps
>(function CopyToClipboardButtonRoot(
  {
    clipboardText,
    tooltipText,
    icon = "FeatherClipboard",
    className,
    ...otherProps
  }: CopyToClipboardButtonRootProps,
  ref
) {
  return (
    <SubframeCore.Tooltip.Provider>
      <SubframeCore.Tooltip.Root>
        <SubframeCore.Tooltip.Trigger asChild={true}>
          <SubframeCore.CopyToClipboard.Root
            clipboardText={clipboardText}
            {...otherProps}
          >
            <div
              className={SubframeCore.twClassNames(
                "group/e8c76626 flex h-6 w-6 cursor-pointer flex-col items-center justify-center gap-2 rounded hover:bg-neutral-100",
                className
              )}
              ref={ref as any}
            >
              <SubframeCore.Icon
                className="text-body font-body text-subtext-color group-hover/e8c76626:text-default-font"
                name={icon}
              />
            </div>
          </SubframeCore.CopyToClipboard.Root>
        </SubframeCore.Tooltip.Trigger>
        <SubframeCore.Tooltip.Portal>
          <SubframeCore.Tooltip.Content
            side="bottom"
            align="center"
            sideOffset={8}
            asChild={true}
          >
            <Tooltip>{tooltipText}</Tooltip>
          </SubframeCore.Tooltip.Content>
        </SubframeCore.Tooltip.Portal>
      </SubframeCore.Tooltip.Root>
    </SubframeCore.Tooltip.Provider>
  );
});

export const CopyToClipboardButton = CopyToClipboardButtonRoot;
