"use client";
/*
 * Documentation:
 * Fullscreen Dialog — https://app.subframe.com/library?component=Fullscreen+Dialog_3f094173-71de-4378-a09a-05c482f7a137
 * Icon Button — https://app.subframe.com/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 * Alert — https://app.subframe.com/library?component=Alert_3a65613d-d546-467c-80f4-aaba6a7edcd5
 * Text Field — https://app.subframe.com/library?component=Text+Field_be48ca43-f8e7-4c0e-8870-d219ea11abfe
 * Radio Card Group — https://app.subframe.com/library?component=Radio+Card+Group_6d5193b8-6043-4dc1-aad5-7f902ef872df
 * Checkbox Card — https://app.subframe.com/library?component=Checkbox+Card_de0b4dfb-3946-4702-be52-5678dd71925a
 * Button — https://app.subframe.com/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface FullscreenDialogRootProps
  extends React.ComponentProps<typeof SubframeCore.FullScreenDialog.Root> {
  children?: React.ReactNode;
  className?: string;
}

const FullscreenDialogRoot = React.forwardRef<
  HTMLElement,
  FullscreenDialogRootProps
>(function FullscreenDialogRoot(
  { children, className, ...otherProps }: FullscreenDialogRootProps,
  ref
) {
  return children ? (
    <SubframeCore.FullScreenDialog.Root asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex h-full w-full flex-col items-start bg-default-background",
          className
        )}
        ref={ref as any}
      >
        {children}
      </div>
    </SubframeCore.FullScreenDialog.Root>
  ) : null;
});

export const FullscreenDialog = FullscreenDialogRoot;
