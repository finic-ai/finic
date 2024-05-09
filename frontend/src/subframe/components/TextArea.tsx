"use client";
/*
 * Documentation:
 * Text Area — https://app.subframe.com/library?component=Text+Area_4ec05ee8-8f1c-46b2-b863-5419aa7f5cce
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  className?: string;
}

const Input = React.forwardRef<HTMLElement, InputProps>(function Input(
  { placeholder, className, ...otherProps }: InputProps,
  ref
) {
  return (
    <textarea
      className={SubframeCore.twClassNames(
        "min-h-[96px] w-full border-none bg-transparent pt-1.5 pr-2 pb-1.5 pl-2 text-body font-body text-default-font outline-none",
        className
      )}
      placeholder={placeholder}
      ref={ref as any}
      {...otherProps}
    />
  );
});

interface TextAreaRootProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  error?: boolean;
  variant?: "outline" | "filled";
  label?: string;
  helpText?: string;
  children?: React.ReactNode;
  className?: string;
}

const TextAreaRoot = React.forwardRef<HTMLElement, TextAreaRootProps>(
  function TextAreaRoot(
    {
      error = false,
      variant = "outline",
      label,
      helpText,
      children,
      className,
      ...otherProps
    }: TextAreaRootProps,
    ref
  ) {
    return (
      <label
        className={SubframeCore.twClassNames(
          "group/4ec05ee8 flex flex-col items-start gap-1",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {label ? (
          <span className="text-body-bold font-body-bold text-default-font">
            {label}
          </span>
        ) : null}
        {children ? (
          <div
            className={SubframeCore.twClassNames(
              "flex h-full w-full grow shrink-0 basis-0 flex-col items-start rounded border border-solid border-neutral-border bg-default-background pl-1 group-focus-within/4ec05ee8:border group-focus-within/4ec05ee8:border-solid group-focus-within/4ec05ee8:border-brand-primary",
              {
                "border border-solid border-neutral-100 bg-neutral-100 group-hover/4ec05ee8:border group-hover/4ec05ee8:border-solid group-hover/4ec05ee8:border-neutral-border group-focus-within/4ec05ee8:bg-default-background":
                  variant === "filled",
                "border border-solid border-error-600": error,
              }
            )}
          >
            {children}
          </div>
        ) : null}
        {helpText ? (
          <span
            className={SubframeCore.twClassNames(
              "text-caption font-caption text-subtext-color",
              { "text-error-700": error }
            )}
          >
            {helpText}
          </span>
        ) : null}
      </label>
    );
  }
);

export const TextArea = Object.assign(TextAreaRoot, {
  Input,
});
