"use client";
/*
 * Documentation:
 * Message Request Card — https://app.subframe.com/cb0b7d209a24/library?component=Message+Request+Card_4501145a-a5e7-473b-947a-c6997cd277a6
 * Link Button — https://app.subframe.com/cb0b7d209a24/library?component=Link+Button_a4ee726a-774c-4091-8c49-55b659356024
 * Icon Button — https://app.subframe.com/cb0b7d209a24/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 * Button — https://app.subframe.com/cb0b7d209a24/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { LinkButton } from "./LinkButton";
import { IconButton } from "./IconButton";
import { Button } from "./Button";

interface MessageRequestCardRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  fullName?: string;
  message?: string;
  companyName?: string;
  showLinkedin?: boolean;
  showCompany?: boolean;
  className?: string;
}

const MessageRequestCardRoot = React.forwardRef<
  HTMLElement,
  MessageRequestCardRootProps
>(function MessageRequestCardRoot(
  {
    fullName,
    message,
    companyName,
    showLinkedin = false,
    showCompany = false,
    className,
    ...otherProps
  }: MessageRequestCardRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/4501145a flex w-full flex-col items-start gap-2 border-b border-solid border-neutral-border pt-8 pr-6 pb-8 pl-6",
        { "flex-col gap-2": showCompany },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex w-full items-center gap-2">
        <div className="flex grow shrink-0 basis-0 items-start">
          <div
            className={SubframeCore.twClassNames("flex items-center gap-2", {
              "flex-row gap-2": showCompany,
            })}
          >
            <div className="flex flex-col items-start">
              {fullName ? (
                <span className="text-subheader font-subheader text-default-font">
                  {fullName}
                </span>
              ) : null}
              <LinkButton
                className={SubframeCore.twClassNames("hidden", {
                  flex: showCompany,
                })}
                disabled={false}
                icon={null}
              >
                {companyName}
              </LinkButton>
            </div>
            <IconButton
              className={SubframeCore.twClassNames("hidden", {
                flex: showLinkedin,
              })}
              disabled={false}
              variant="brand-tertiary"
              size="large"
              icon="FeatherLinkedin"
            />
          </div>
        </div>
        <Button variant="neutral-tertiary" size="large">
          Ignore
        </Button>
        <Button variant="brand-primary" size="large">
          Accept
        </Button>
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

export const MessageRequestCard = MessageRequestCardRoot;
