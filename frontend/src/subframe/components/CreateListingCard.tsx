"use client";
/*
 * Documentation:
 * Create Listing Card — https://app.subframe.com/cb0b7d209a24/library?component=Create+Listing+Card_eb66ccaf-7602-4316-aa9a-215aecf8993d
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface CreateListingCardRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CreateListingCardRoot = React.forwardRef<
  HTMLElement,
  CreateListingCardRootProps
>(function CreateListingCardRoot(
  { className, ...otherProps }: CreateListingCardRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/eb66ccaf flex h-full w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border border-solid border-neutral-border hover:flex-row hover:items-center hover:justify-center hover:gap-2 hover:bg-brand-50",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex items-center justify-center gap-1 pt-5 pr-4 pb-5 pl-4 group-hover/eb66ccaf:flex-row group-hover/eb66ccaf:items-center group-hover/eb66ccaf:justify-center group-hover/eb66ccaf:gap-1">
        <SubframeCore.Icon
          className="text-body font-body text-default-font"
          name="FeatherPlus"
        />
        <span className="text-label-bold font-label-bold text-default-font">
          Create new listing
        </span>
      </div>
    </div>
  );
});

export const CreateListingCard = CreateListingCardRoot;
