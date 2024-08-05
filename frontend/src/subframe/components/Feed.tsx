"use client";
/*
 * Documentation:
 * Feed — https://app.subframe.com/cb0b7d209a24/library?component=Feed_7d554e3e-c194-4acf-8d18-5fba3a57892f
 * Icon with background — https://app.subframe.com/cb0b7d209a24/library?component=Icon+with+background_c5d68c0e-4c0c-4cff-8d8c-6ff334859b3a
 * Avatar — https://app.subframe.com/cb0b7d209a24/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  leftSlot?: React.ReactNode;
  comment?: React.ReactNode;
  timestamp?: string;
  isLast?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  {
    leftSlot,
    comment,
    timestamp,
    isLast = false,
    children,
    className,
    ...otherProps
  }: ItemProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/c6162651 flex h-full w-full items-start gap-4",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex flex-col items-center self-stretch">
        {leftSlot ? (
          <div className="flex flex-col items-start gap-1">{leftSlot}</div>
        ) : null}
        <div
          className={SubframeCore.twClassNames(
            "flex w-0.5 grow shrink-0 basis-0 flex-col items-start gap-2 bg-neutral-border",
            { hidden: isLast }
          )}
        />
      </div>
      <div
        className={SubframeCore.twClassNames(
          "flex grow shrink-0 basis-0 flex-col items-end gap-2 pt-1.5 pb-6",
          { "pt-1 pr-0 pb-1 pl-0": isLast }
        )}
      >
        <div className="flex w-full flex-wrap items-center gap-2">
          {children ? (
            <div className="flex grow shrink-0 basis-0 flex-wrap items-start gap-1">
              {children}
            </div>
          ) : null}
          {timestamp ? (
            <span className="text-label font-label text-subtext-color">
              {timestamp}
            </span>
          ) : null}
        </div>
        {comment ? (
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2">
            {comment}
          </div>
        ) : null}
      </div>
    </div>
  );
});

interface CommentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: string;
  className?: string;
}

const Comment = React.forwardRef<HTMLElement, CommentProps>(function Comment(
  { children, className, ...otherProps }: CommentProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex max-w-[576px] flex-col items-start gap-2 rounded-md bg-neutral-50 pt-2 pr-4 pb-2 pl-4",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {children ? (
        <span className="text-body font-body text-default-font">
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface FeedRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const FeedRoot = React.forwardRef<HTMLElement, FeedRootProps>(function FeedRoot(
  { children, className, ...otherProps }: FeedRootProps,
  ref
) {
  return children ? (
    <div
      className={SubframeCore.twClassNames(
        "flex w-full flex-col items-start",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {children}
    </div>
  ) : null;
});

export const Feed = Object.assign(FeedRoot, {
  Item,
  Comment,
});
