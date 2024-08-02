"use client";
/*
 * Documentation:
 * OAuth Social Button — https://app.subframe.com/library?component=OAuth+Social+Button_f1948f75-65f9-4f21-b3e4-a49511440c26
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface OAuthSocialButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: string;
  logo?: string;
  className?: string;
}

const OAuthSocialButtonRoot = React.forwardRef<
  HTMLElement,
  OAuthSocialButtonRootProps
>(function OAuthSocialButtonRoot(
  {
    children,
    logo,
    className,
    type = "button",
    ...otherProps
  }: OAuthSocialButtonRootProps,
  ref
) {
  return (
    <button
      className={SubframeCore.twClassNames(
        "group/f1948f75 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-solid border-neutral-border bg-white pr-4 pl-4 hover:bg-neutral-50 active:bg-white disabled:cursor-default disabled:bg-white hover:disabled:cursor-default hover:disabled:bg-white active:disabled:cursor-default active:disabled:bg-white",
        className
      )}
      ref={ref as any}
      type={type}
      {...otherProps}
    >
      {logo ? <img className="h-5 w-5 flex-none" src={logo} /> : null}
      {children ? (
        <span className="text-body-bold font-body-bold text-neutral-700 group-disabled/f1948f75:text-neutral-400">
          {children}
        </span>
      ) : null}
    </button>
  );
});

export const OAuthSocialButton = OAuthSocialButtonRoot;
