"use client";
/*
 * Documentation:
 * Home Card — https://app.subframe.com/library?component=Home+Card_318fa7af-69f9-4374-8e26-8ec8007254b5
 * Icon with background — https://app.subframe.com/library?component=Icon+with+background_c5d68c0e-4c0c-4cff-8d8c-6ff334859b3a
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { IconWithBackground } from "./IconWithBackground";

interface HomeCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: SubframeCore.IconName;
  className?: string;
}

const HomeCardRoot = React.forwardRef<HTMLElement, HomeCardRootProps>(
  function HomeCardRoot(
    {
      title,
      subtitle,
      icon = "FeatherAppWindow",
      className,
      ...otherProps
    }: HomeCardRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/318fa7af flex h-full w-full cursor-pointer flex-col items-center gap-2 rounded-md border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default hover:bg-neutral-50",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <IconWithBackground size="medium" icon={icon} />
        <div className="flex w-full flex-col items-center gap-1">
          {title ? (
            <span className="line-clamp-1 w-full text-body-bold font-body-bold text-default-font text-center">
              {title}
            </span>
          ) : null}
          {subtitle ? (
            <span className="w-full text-label font-label text-subtext-color text-center">
              {subtitle}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

export const HomeCard = HomeCardRoot;
