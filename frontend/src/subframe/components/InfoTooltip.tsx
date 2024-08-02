"use client";
/*
 * Documentation:
 * Info tooltip — https://app.subframe.com/library?component=Info+tooltip_58466bc5-c62e-47fb-9394-3b607f233dfa
 * Tooltip — https://app.subframe.com/library?component=Tooltip_ccebd1e9-f6ac-4737-8376-0dfacd90c9f3
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Tooltip } from "./Tooltip";

interface InfoTooltipRootProps
  extends SubframeCore.TypescriptHelpers.Optional<
    React.ComponentProps<typeof SubframeCore.Icon>,
    "name"
  > {
  tooltipText?: string;
  size?: "default" | "subheader" | "section-header" | "header";
  className?: string;
}

const InfoTooltipRoot = React.forwardRef<HTMLElement, InfoTooltipRootProps>(
  function InfoTooltipRoot(
    {
      tooltipText,
      size = "default",
      className,
      ...otherProps
    }: InfoTooltipRootProps,
    ref
  ) {
    return (
      <SubframeCore.Tooltip.Provider>
        <SubframeCore.Tooltip.Root>
          <SubframeCore.Tooltip.Trigger asChild={true}>
            <SubframeCore.Icon
              className={SubframeCore.twClassNames(
                "group/58466bc5 text-body font-body text-neutral-700",
                {
                  "text-header font-header": size === "header",
                  "text-section-header font-section-header":
                    size === "section-header",
                  "text-subheader font-subheader": size === "subheader",
                },
                className
              )}
              name="FeatherInfo"
              ref={ref as any}
              {...otherProps}
            />
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
  }
);

export const InfoTooltip = InfoTooltipRoot;
