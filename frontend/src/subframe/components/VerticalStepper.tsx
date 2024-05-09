"use client";
/*
 * Documentation:
 * Vertical Stepper — https://app.subframe.com/library?component=Vertical+Stepper_bdc0291d-b5be-40c5-ae2f-527a868488b2
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "completed" | "active";
  stepNumber?: string;
  label?: string;
  firstStep?: boolean;
  lastStep?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Step = React.forwardRef<HTMLElement, StepProps>(function Step(
  {
    variant = "default",
    stepNumber,
    label,
    firstStep = false,
    lastStep = false,
    children,
    className,
    ...otherProps
  }: StepProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/b094efab flex h-full w-full items-start gap-3",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div
        className={SubframeCore.twClassNames(
          "flex h-full flex-col items-center",
          { "h-auto w-auto flex-none": lastStep }
        )}
      >
        <div
          className={SubframeCore.twClassNames(
            "flex h-3 w-0.5 flex-none flex-col items-center gap-2 bg-neutral-border",
            { "h-3 w-0.5 flex-none": lastStep, hidden: firstStep }
          )}
        />
        <div
          className={SubframeCore.twClassNames(
            "flex h-7 w-7 flex-none items-center justify-center overflow-hidden rounded-full bg-neutral-100",
            {
              "border-2 border-solid border-brand-600 bg-brand-600":
                variant === "active",
              "bg-brand-100": variant === "completed",
            }
          )}
        >
          {stepNumber ? (
            <span
              className={SubframeCore.twClassNames(
                "text-body-bold font-body-bold text-subtext-color",
                {
                  "text-body-bold font-body-bold text-white":
                    variant === "active",
                  hidden: variant === "completed",
                }
              )}
            >
              {stepNumber}
            </span>
          ) : null}
          <SubframeCore.Icon
            className={SubframeCore.twClassNames(
              "hidden text-heading-3 font-heading-3 text-default-font",
              { "inline-flex text-brand-700": variant === "completed" }
            )}
            name="FeatherCheck"
          />
        </div>
        <div
          className={SubframeCore.twClassNames(
            "flex h-full min-h-[12px] w-0.5 grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border",
            { hidden: lastStep }
          )}
        />
      </div>
      <div
        className={SubframeCore.twClassNames(
          "flex w-full grow shrink-0 basis-0 flex-col items-center gap-1 pt-4 pb-4",
          { "pt-4 pr-0 pb-1 pl-0": lastStep, "pt-1 pr-0 pb-4 pl-0": firstStep }
        )}
      >
        {label ? (
          <span
            className={SubframeCore.twClassNames(
              "line-clamp-2 w-full text-body font-body text-subtext-color",
              {
                "text-body-bold font-body-bold text-default-font":
                  variant === "active",
                "text-body font-body text-default-font":
                  variant === "completed",
              }
            )}
          >
            {label}
          </span>
        ) : null}
        {children ? (
          <div className="flex w-full flex-col items-start gap-2">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
});

interface VerticalStepperRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const VerticalStepperRoot = React.forwardRef<
  HTMLElement,
  VerticalStepperRootProps
>(function VerticalStepperRoot(
  { children, className, ...otherProps }: VerticalStepperRootProps,
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
});

export const VerticalStepper = Object.assign(VerticalStepperRoot, {
  Step,
});
