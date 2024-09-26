"use client";
/*
 * Documentation:
 * Properties Accordion — https://app.subframe.com/0bc1b5ae3457/library?component=Properties+Accordion_90a4daf8-09e8-4402-b7b1-442a7b019644
 * Text Field — https://app.subframe.com/0bc1b5ae3457/library?component=Text+Field_be48ca43-f8e7-4c0e-8870-d219ea11abfe
 * Accordion — https://app.subframe.com/0bc1b5ae3457/library?component=Accordion_d2e81e20-863a-4027-826a-991d8910efd9
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Accordion } from "./Accordion";

interface PropertiesAccordionRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const PropertiesAccordionRoot = React.forwardRef<
  HTMLElement,
  PropertiesAccordionRootProps
>(function PropertiesAccordionRoot(
  { title, children, className, ...otherProps }: PropertiesAccordionRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex w-full flex-col items-start border-b border-solid border-neutral-border bg-default-background",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <Accordion
        trigger={
          <div className="flex w-full items-center gap-2 pt-3 pr-4 pb-3 pl-4">
            {title ? (
              <span className="grow shrink-0 basis-0 text-caption-bold font-caption-bold text-default-font">
                {title}
              </span>
            ) : null}
            <Accordion.Chevron />
          </div>
        }
        defaultOpen={true}
      >
        {children ? (
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 pr-4 pb-4 pl-4">
            {children}
          </div>
        ) : null}
      </Accordion>
    </div>
  );
});

export const PropertiesAccordion = PropertiesAccordionRoot;
