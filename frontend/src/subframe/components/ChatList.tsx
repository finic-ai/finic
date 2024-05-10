"use client";
/*
 * Documentation:
 * Chat List — https://app.subframe.com/library?component=Chat+List_9f84143a-2d75-4ddd-b8c2-ffbe0afe77a1
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ChatListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  replied?: boolean;
  unread?: boolean;
  selected?: boolean;
  avatar?: React.ReactNode;
  time?: string;
  message?: string;
  className?: string;
}

const ChatListItem = React.forwardRef<HTMLElement, ChatListItemProps>(
  function ChatListItem(
    {
      name,
      replied = false,
      unread = false,
      selected = false,
      avatar,
      time,
      message,
      className,
      ...otherProps
    }: ChatListItemProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/91a2767c flex w-full cursor-pointer items-start gap-2 border-b border-solid border-neutral-border pt-3 pr-3 pb-3 pl-3 hover:bg-brand-50",
          { "bg-brand-100": selected },
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {avatar ? (
          <div className="flex h-9 w-9 flex-none items-start gap-2">
            {avatar}
          </div>
        ) : null}
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-0.5">
          <div className="flex w-full items-start gap-2">
            {name ? (
              <span className="w-full grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
                {name}
              </span>
            ) : null}
            {time ? (
              <span
                className={SubframeCore.twClassNames(
                  "text-body font-body text-subtext-color",
                  { "text-default-font": unread }
                )}
              >
                {time}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <SubframeCore.Icon
              className={SubframeCore.twClassNames(
                "hidden text-body-bold font-body-bold text-subtext-color",
                { "inline-flex": replied }
              )}
              name="FeatherCornerUpLeft"
            />
            {message ? (
              <span
                className={SubframeCore.twClassNames(
                  "w-full grow shrink-0 basis-0 text-body font-body text-default-font",
                  {
                    "text-body-bold font-body-bold": unread,
                    "text-body font-body": replied,
                  }
                )}
              >
                {message}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

interface ChatListRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ChatListRoot = React.forwardRef<HTMLElement, ChatListRootProps>(
  function ChatListRoot(
    { children, className, ...otherProps }: ChatListRootProps,
    ref
  ) {
    return children ? (
      <div
        className={SubframeCore.twClassNames(
          "flex flex-col items-start",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children}
      </div>
    ) : null;
  }
);

export const ChatList = Object.assign(ChatListRoot, {
  ChatListItem,
});
