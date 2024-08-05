"use client";
/*
 * Documentation:
 * Steps — https://app.subframe.com/cb0b7d209a24/library?component=Steps_1d5e50a5-9857-430e-8cb6-67a6720881f3
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Avatar } from "./Avatar";
import { IconWithBackground } from "./IconWithBackground";

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  firstStep?: boolean;
  lastStep?: boolean;
  variant?: "default" | "success" | "error" | "active";
  stepNumber?: string;
  className?: string;
}

const Step = React.forwardRef<HTMLElement, StepProps>(function Step(
  {
    name,
    firstStep = false,
    lastStep = false,
    variant = "default",
    stepNumber,
    className,
    ...otherProps
  }: StepProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/68359b37 flex w-full cursor-pointer flex-col items-center justify-center gap-1",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex w-full items-center justify-center gap-2">
        <div
          className={SubframeCore.twClassNames(
            "flex h-px grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-300",
            { "bg-transparent": firstStep }
          )}
        />
        <div className="flex items-center justify-center">
          <Avatar
            className={SubframeCore.twClassNames({
              hidden:
                variant === "active" ||
                variant === "error" ||
                variant === "success",
            })}
            variant="neutral"
            size="small"
          >
            {stepNumber}
          </Avatar>
          <Avatar
            className={SubframeCore.twClassNames("hidden", {
              flex: variant === "active",
            })}
            variant="neutral"
            size="small"
          >
            {stepNumber}
          </Avatar>
          <IconWithBackground
            className={SubframeCore.twClassNames("hidden", {
              flex: variant === "error",
            })}
            variant="error"
            size="small"
            icon="FeatherX"
          />
          <IconWithBackground
            className={SubframeCore.twClassNames("hidden", {
              flex: variant === "success",
            })}
            variant="success"
            size="small"
          />
        </div>
        <div
          className={SubframeCore.twClassNames(
            "flex h-px grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-300",
            { "bg-transparent": lastStep }
          )}
        />
      </div>
      {name ? (
        <span
          className={SubframeCore.twClassNames(
            "text-body font-body text-subtext-color group-hover/68359b37:text-default-font",
            {
              "text-body-bold font-body-bold text-default-font":
                variant === "active" ||
                variant === "error" ||
                variant === "success",
            }
          )}
        >
          {name}
        </span>
      ) : null}
    </div>
  );
});

interface StepsRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const StepsRoot = React.forwardRef<HTMLElement, StepsRootProps>(
  function StepsRoot(
    { children, className, ...otherProps }: StepsRootProps,
    ref
  ) {
    return children ? (
      <div
        className={SubframeCore.twClassNames(
          "flex w-full items-start justify-center",
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

export const Steps = Object.assign(StepsRoot, {
  Step,
});
