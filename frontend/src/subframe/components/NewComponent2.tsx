"use client";
/*
 * Documentation:
 * New Component2 — https://app.subframe.com/cb0b7d209a24/library?component=New+Component2_b286f60c-a632-4e8c-9687-d2b3bd0a4b5a
 * Icon Button — https://app.subframe.com/cb0b7d209a24/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 * Avatar — https://app.subframe.com/cb0b7d209a24/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { IconButton } from "./IconButton";
import { Avatar } from "./Avatar";

interface NewComponent2RootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const NewComponent2Root = React.forwardRef<HTMLElement, NewComponent2RootProps>(
  function NewComponent2Root(
    { className, ...otherProps }: NewComponent2RootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex w-full items-center justify-end border-b border-solid border-neutral-border pt-2 pr-2 pb-2 pl-2",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <IconButton
          variant="neutral-tertiary"
          size="large"
          icon="FeatherSearch"
          loading={false}
        />
        <Avatar>A</Avatar>
      </div>
    );
  }
);

export const NewComponent2 = NewComponent2Root;
