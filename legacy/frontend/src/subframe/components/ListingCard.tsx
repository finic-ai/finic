"use client";
/*
 * Documentation:
 * Listing Card — https://app.subframe.com/cb0b7d209a24/library?component=Listing+Card_cc674cf2-7111-4f75-8744-3ec3ddd3f437
 * Tooltip — https://app.subframe.com/cb0b7d209a24/library?component=Tooltip_ccebd1e9-f6ac-4737-8376-0dfacd90c9f3
 * Badge — https://app.subframe.com/cb0b7d209a24/library?component=Badge_97bdb082-1124-4dd7-a335-b14b822d0157
 * Detail Card — https://app.subframe.com/cb0b7d209a24/library?component=Detail+Card_7b4c33d9-098f-461c-a804-7905f589dc59
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Tooltip } from "./Tooltip";
import { Badge } from "./Badge";
import { DetailCard } from "./DetailCard";

interface ListingCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  type?: string;
  revenue?: string;
  price?: string;
  className?: string;
}

const ListingCardRoot = React.forwardRef<HTMLElement, ListingCardRootProps>(
  function ListingCardRoot(
    {
      title,
      type,
      revenue,
      price,
      className,
      ...otherProps
    }: ListingCardRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/cc674cf2 flex w-full cursor-pointer items-start gap-6 border-b border-solid border-neutral-border pt-8 pr-6 pb-8 pl-6 hover:bg-brand-50",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex items-start gap-4 self-stretch pt-1">
          <SubframeCore.Icon
            className="text-[18px] font-[500] leading-[24px] text-neutral-400 group-hover/cc674cf2:text-brand-600"
            name="FeatherBuilding"
          />
        </div>
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4">
          <div className="flex w-full grow shrink-0 basis-0 items-center gap-2">
            {title ? (
              <span className="grow shrink-0 basis-0 text-subheader font-subheader text-default-font">
                {title}
              </span>
            ) : null}
            <div className="flex flex-col items-center gap-2 self-stretch pt-1">
              <SubframeCore.Tooltip.Provider>
                <SubframeCore.Tooltip.Root>
                  <SubframeCore.Tooltip.Trigger asChild={true}>
                    <Badge variant="brand" icon="FeatherInfo">
                      New
                    </Badge>
                  </SubframeCore.Tooltip.Trigger>
                  <SubframeCore.Tooltip.Portal>
                    <SubframeCore.Tooltip.Content
                      side="bottom"
                      align="center"
                      sideOffset={8}
                      asChild={true}
                    >
                      <Tooltip>Tooltip</Tooltip>
                    </SubframeCore.Tooltip.Content>
                  </SubframeCore.Tooltip.Portal>
                </SubframeCore.Tooltip.Root>
              </SubframeCore.Tooltip.Provider>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-start gap-4">
            <DetailCard label="Type" value={type} small={true} />
            <DetailCard label="Revenue" value={revenue} small={true} />
            <DetailCard label="Price" value={price} small={true} />
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 self-stretch">
          <SubframeCore.Icon
            className="text-section-header font-section-header text-neutral-300 group-hover/cc674cf2:text-brand-600"
            name="FeatherChevronRight"
          />
        </div>
      </div>
    );
  }
);

export const ListingCard = ListingCardRoot;
