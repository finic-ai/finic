"use client";
/*
 * Documentation:
 * Dialog Layout — https://app.subframe.com/library?component=Dialog+Layout_ff4920a8-df26-4012-934d-0a9edbf5e373
 * Dialog — https://app.subframe.com/library?component=Dialog_ca59db17-43fb-4247-8094-3c55162e902d
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Dialog } from "../components/Dialog";

interface DialogLayoutRootProps extends React.ComponentProps<typeof Dialog> {
  children?: React.ReactNode;
  className?: string;
}

const DialogLayoutRoot = React.forwardRef<HTMLElement, DialogLayoutRootProps>(
  function DialogLayoutRoot(
    { children, className, ...otherProps }: DialogLayoutRootProps,
    ref
  ) {
    return (
      <Dialog className={className} ref={ref as any} {...otherProps}>
        <Dialog.Content>
          {children ? (
            <div className="flex h-full w-full grow shrink-0 basis-0 items-start gap-6">
              {children}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog>
    );
  }
);

export const DialogLayout = DialogLayoutRoot;
