"use client";
/*
 * Documentation:
 * Edit Listing Card — https://app.subframe.com/library?component=Edit+Listing+Card_0a2f8f32-a8e8-4928-9a21-177d2b96c53e
 * Icon with background — https://app.subframe.com/library?component=Icon+with+background_c5d68c0e-4c0c-4cff-8d8c-6ff334859b3a
 * Button — https://app.subframe.com/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { IconWithBackground } from "./IconWithBackground";
import { Button } from "./Button";

interface EditListingCardRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  text?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  text5?: string;
  className?: string;
}

const EditListingCardRoot = React.forwardRef<
  HTMLElement,
  EditListingCardRootProps
>(function EditListingCardRoot(
  {
    icon = "FeatherNewspaper",
    text,
    text2,
    text3,
    text4,
    text5,
    className,
    ...otherProps
  }: EditListingCardRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/0a2f8f32 flex h-36 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md border border-solid border-neutral-border hover:bg-brand-50",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex h-full w-24 flex-none items-center justify-center gap-2 bg-brand-50 pt-4 pr-4 pb-4 pl-4">
        <SubframeCore.Icon
          className="text-[32px] font-[400] leading-[32px] text-brand-700"
          name={icon}
        />
      </div>
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 pt-5 pr-4 pb-5 pl-4">
        <div className="flex w-full flex-col items-start gap-1">
          {text ? (
            <span className="line-clamp-1 w-full text-subheader font-subheader text-default-font">
              {text}
            </span>
          ) : null}
          {text2 ? (
            <span className="line-clamp-1 w-full text-body font-body text-default-font">
              {text2}
            </span>
          ) : null}
          {text3 ? (
            <span className="w-full text-label font-label text-subtext-color">
              {text3}
            </span>
          ) : null}
        </div>
        <div className="flex w-full flex-wrap items-start gap-6">
          <div className="flex items-center gap-1">
            <IconWithBackground variant="neutral" icon="FeatherHeart" />
            {text4 ? (
              <span className="text-label-bold font-label-bold text-subtext-color">
                {text4}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <IconWithBackground variant="neutral" icon="FeatherBookmark" />
            {text5 ? (
              <span className="text-label-bold font-label-bold text-subtext-color">
                {text5}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-4 pr-6 pb-4 pl-4">
        <Button variant="brand-tertiary" size="large">
          Edit
        </Button>
      </div>
    </div>
  );
});

export const EditListingCard = EditListingCardRoot;
