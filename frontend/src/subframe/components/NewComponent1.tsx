"use client";
/*
 * Documentation:
 * New Component1 — https://app.subframe.com/library?component=New+Component1_cb33acd9-ddb1-4184-aa35-aa048f08692a
 * Icon Button — https://app.subframe.com/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 * Avatar — https://app.subframe.com/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { IconButton } from "./IconButton";
import { Avatar } from "./Avatar";

interface NewComponent1RootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const NewComponent1Root = React.forwardRef<HTMLElement, NewComponent1RootProps>(
  function NewComponent1Root(
    { className, ...otherProps }: NewComponent1RootProps,
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
        <Avatar>AB</Avatar>
      </div>
    );
  }
);

export const NewComponent1 = NewComponent1Root;
