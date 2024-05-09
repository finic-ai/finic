"use client";
/*
 * Documentation:
 * Drawer Layout — https://app.subframe.com/library?component=Drawer+Layout_2f6803ed-5ed0-4934-b093-a1a46df2d1d1
 * Drawer — https://app.subframe.com/library?component=Drawer_1e71b2cb-8d72-4e67-b368-8805179e9444
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Drawer } from "../components/Drawer";

interface DrawerLayoutRootProps extends React.ComponentProps<typeof Drawer> {
  children?: React.ReactNode;
  className?: string;
}

const DrawerLayoutRoot = React.forwardRef<HTMLElement, DrawerLayoutRootProps>(
  function DrawerLayoutRoot(
    { children, className, ...otherProps }: DrawerLayoutRootProps,
    ref
  ) {
    return (
      <Drawer className={className} ref={ref as any} {...otherProps}>
        <Drawer.Content>
          {children ? (
            <div className="flex h-full w-full grow shrink-0 basis-0 flex-col items-start gap-8">
              {children}
            </div>
          ) : null}
        </Drawer.Content>
      </Drawer>
    );
  }
);

export const DrawerLayout = DrawerLayoutRoot;
