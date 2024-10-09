"use client";
/*
 * Documentation:
 * Todo Tile — https://app.subframe.com/cb0b7d209a24/library?component=Todo+Tile_847ae027-2167-4922-bc01-9e7057de362a
 * Button — https://app.subframe.com/cb0b7d209a24/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 * Todo Card — https://app.subframe.com/cb0b7d209a24/library?component=Todo+Card_5a526da3-4a65-42ce-99bf-72b716eced31
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Button } from "./Button";

interface TodoTileRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  hideViewAll?: boolean;
  className?: string;
}

const TodoTileRoot = React.forwardRef<HTMLElement, TodoTileRootProps>(
  function TodoTileRoot(
    {
      children,
      hideViewAll = false,
      className,
      ...otherProps
    }: TodoTileRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/847ae027 flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="hidden w-full flex-col items-start gap-2 pt-4 pr-6 pb-4 pl-6">
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-subheader font-subheader text-default-font">
              To-do
            </span>
            <Button
              className={SubframeCore.twClassNames({ hidden: hideViewAll })}
              disabled={false}
              variant="brand-tertiary"
              size="small"
              iconRight="FeatherChevronRight"
            >
              View all
            </Button>
          </div>
        </div>
        <div className="hidden h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
        {children ? (
          <div className="flex w-full flex-col items-start pt-1 pr-1 pb-1 pl-1">
            {children}
          </div>
        ) : null}
      </div>
    );
  }
);

export const TodoTile = TodoTileRoot;
