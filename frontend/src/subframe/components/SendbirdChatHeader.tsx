"use client";
/*
 * Documentation:
 * Sendbird Chat Header — https://app.subframe.com/library?component=Sendbird+Chat+Header_e029df5a-e971-45de-bc11-a8d0e29ddb10
 * Icon Button — https://app.subframe.com/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 * Link Button — https://app.subframe.com/library?component=Link+Button_a4ee726a-774c-4091-8c49-55b659356024
 * Button — https://app.subframe.com/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { IconButton } from "./IconButton";
import { LinkButton } from "./LinkButton";
import { Button } from "./Button";

interface SendbirdChatHeaderRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  fullName?: string;
  listingName?: string;
  url?: string;
  className?: string;
}

const SendbirdChatHeaderRoot = React.forwardRef<
  HTMLElement,
  SendbirdChatHeaderRootProps
>(function SendbirdChatHeaderRoot(
  {
    fullName,
    listingName,
    url,
    className,
    ...otherProps
  }: SendbirdChatHeaderRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex w-full items-start gap-2 border-b border-solid border-neutral-border pt-2.5 pr-6 pb-2.5 pl-6",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex w-full grow shrink-0 basis-0 items-start gap-2">
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start">
          <div className="flex items-center gap-2">
            {fullName ? (
              <span className="text-body-bold font-body-bold text-default-font">
                {fullName}
              </span>
            ) : null}
            <IconButton size="small" icon="FeatherLinkedin" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-label font-label text-subtext-color">
              Listing:
            </span>
            <LinkButton size="small" icon="FeatherLink">
              {listingName}
            </LinkButton>
          </div>
        </div>
        <Button size="large">Book meeting</Button>
      </div>
    </div>
  );
});

export const SendbirdChatHeader = SendbirdChatHeaderRoot;
