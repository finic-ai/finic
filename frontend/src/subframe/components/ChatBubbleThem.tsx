"use client";
/*
 * Documentation:
 * Chat Bubble Them — https://app.subframe.com/cb0b7d209a24/library?component=Chat+Bubble+Them_5fa1557c-fe15-4f3e-85e7-470457d52473
 * Avatar — https://app.subframe.com/cb0b7d209a24/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ChatBubbleThemRootProps extends React.HTMLAttributes<HTMLDivElement> {
  time?: string;
  avatar?: React.ReactNode;
  name?: string;
  message?: string;
  className?: string;
}

const ChatBubbleThemRoot = React.forwardRef<
  HTMLElement,
  ChatBubbleThemRootProps
>(function ChatBubbleThemRoot(
  {
    time,
    avatar,
    name,
    message,
    className,
    ...otherProps
  }: ChatBubbleThemRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex w-full items-start gap-2",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {avatar ? (
        <div className="flex h-9 w-9 flex-none items-start gap-2">{avatar}</div>
      ) : null}
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-start gap-2">
          {name ? (
            <span className="text-body-bold font-body-bold text-default-font">
              {name}
            </span>
          ) : null}
          {time ? (
            <span className="text-body font-body text-subtext-color">
              {time}
            </span>
          ) : null}
        </div>
        <div className="flex w-96 flex-col items-start gap-2 rounded-md bg-neutral-100 pt-2 pr-3 pb-2 pl-3">
          {message ? (
            <span className="text-body font-body text-default-font">
              {message}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export const ChatBubbleThem = ChatBubbleThemRoot;
