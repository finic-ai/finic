"use client";
/*
 * Documentation:
 * Chat Message — https://app.subframe.com/library?component=Chat+Message_e0b80449-ff31-4847-8bd3-ea071e67c7d5
 * Avatar — https://app.subframe.com/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Avatar } from "./Avatar";

interface ChatMessageRootProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  time?: string;
  message?: string;
  className?: string;
}

const ChatMessageRoot = React.forwardRef<HTMLElement, ChatMessageRootProps>(
  function ChatMessageRoot(
    { name, time, message, className, ...otherProps }: ChatMessageRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex items-start gap-2",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex items-start gap-2">
          <Avatar>JD</Avatar>
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <div className="flex items-start gap-2">
            {name ? (
              <span className="text-body-bold font-body-bold text-default-font">
                {name}
              </span>
            ) : null}
            {time ? (
              <span className="text-body font-body text-default-font">
                {time}
              </span>
            ) : null}
          </div>
          {message ? (
            <span className="text-body font-body text-default-font">
              {message}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

export const ChatMessage = ChatMessageRoot;
