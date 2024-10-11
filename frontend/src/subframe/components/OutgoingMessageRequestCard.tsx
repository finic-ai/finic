"use client";
/*
 * Documentation:
 * Outgoing Message Request Card — https://app.subframe.com/cb0b7d209a24/library?component=Outgoing+Message+Request+Card_c7738f9b-c754-41fc-90cc-731c53c36f6d
 * Link Button — https://app.subframe.com/cb0b7d209a24/library?component=Link+Button_a4ee726a-774c-4091-8c49-55b659356024
 * Icon Button — https://app.subframe.com/cb0b7d209a24/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { LinkButton } from "./LinkButton";
import { IconButton } from "./IconButton";

interface OutgoingMessageRequestCardRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  listingName?: string;
  className?: string;
}

const OutgoingMessageRequestCardRoot = React.forwardRef<
  HTMLElement,
  OutgoingMessageRequestCardRootProps
>(function OutgoingMessageRequestCardRoot(
  {
    message,
    listingName,
    className,
    ...otherProps
  }: OutgoingMessageRequestCardRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex w-full flex-col items-start gap-2 border-b border-solid border-neutral-border pt-8 pr-6 pb-8 pl-6",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex w-full items-center gap-2">
        <div className="flex grow shrink-0 basis-0 items-start">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-start">
              {listingName ? (
                <span className="text-subheader font-subheader text-default-font">
                  {listingName}
                </span>
              ) : null}
              <LinkButton className="hidden" disabled={false} icon={null}>
                Company (optional)
              </LinkButton>
            </div>
            <IconButton
              className="hidden"
              disabled={false}
              variant="brand-tertiary"
              size="large"
              icon="FeatherLinkedin"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default">
        {message ? (
          <span className="w-full grow shrink-0 basis-0 whitespace-pre-wrap text-body font-body text-default-font">
            {message}
          </span>
        ) : null}
      </div>
    </div>
  );
});

export const OutgoingMessageRequestCard = OutgoingMessageRequestCardRoot;
