"use client";
/*
 * Documentation:
 * Todo Card — https://app.subframe.com/cb0b7d209a24/library?component=Todo+Card_5a526da3-4a65-42ce-99bf-72b716eced31
 * Icon with background — https://app.subframe.com/cb0b7d209a24/library?component=Icon+with+background_c5d68c0e-4c0c-4cff-8d8c-6ff334859b3a
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { IconWithBackground } from "./IconWithBackground";

interface TodoCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  time?: string;
  className?: string;
}

const TodoCardRoot = React.forwardRef<HTMLElement, TodoCardRootProps>(
  function TodoCardRoot(
    { title, description, time, className, ...otherProps }: TodoCardRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/5a526da3 flex w-full cursor-pointer items-center gap-4 pt-4 pr-4 pb-4 pl-4 hover:bg-brand-50",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <IconWithBackground size="medium" icon="FeatherCalendarCheck" />
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
          {title ? (
            <span className="w-full text-body-bold font-body-bold text-default-font">
              {title}
            </span>
          ) : null}
          {description ? (
            <span className="w-full text-label font-label text-subtext-color">
              {description}
            </span>
          ) : null}
        </div>
        {time ? (
          <span className="text-label font-label text-subtext-color">
            {time}
          </span>
        ) : null}
      </div>
    );
  }
);

export const TodoCard = TodoCardRoot;
