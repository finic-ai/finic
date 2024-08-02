"use client";
/*
 * Documentation:
 * Chat Sent — https://app.subframe.com/library?component=Chat+Sent_8206bfc1-a590-434f-9706-c81a8bc60827
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ChatSentRootProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  message?: string;
  timestamp?: string;
  className?: string;
}

const ChatSentRoot = React.forwardRef<HTMLElement, ChatSentRootProps>(
  function ChatSentRoot(
    { name, message, timestamp, className, ...otherProps }: ChatSentRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex w-full flex-col items-end justify-center gap-1",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex flex-col items-start justify-center gap-1">
          <div className="flex flex-wrap items-center gap-2">
            {name ? (
              <span className="text-body-bold font-body-bold text-default-font">
                {name}
              </span>
            ) : null}
            {timestamp ? (
              <span className="text-label font-label text-subtext-color">
                {timestamp}
              </span>
            ) : null}
          </div>
          <div className="flex w-full max-w-[576px] flex-col items-start gap-2 rounded-md bg-brand-600 pt-2 pr-3 pb-2 pl-3">
            {message ? (
              <span className="text-body font-body text-white">{message}</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

export const ChatSent = ChatSentRoot;
