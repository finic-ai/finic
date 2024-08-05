"use client";
/*
 * Documentation:
 * New Component Copy — https://app.subframe.com/cb0b7d209a24/library?component=New+Component+Copy_957046e4-0417-4a40-b280-7dac785c85ae
 * Chat Sent — https://app.subframe.com/cb0b7d209a24/library?component=Chat+Sent_8206bfc1-a590-434f-9706-c81a8bc60827
 * Avatar — https://app.subframe.com/cb0b7d209a24/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 * Chat Bubble Them — https://app.subframe.com/cb0b7d209a24/library?component=Chat+Bubble+Them_5fa1557c-fe15-4f3e-85e7-470457d52473
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { ChatSent } from "./ChatSent";
import { Avatar } from "./Avatar";
import { ChatBubbleThem } from "./ChatBubbleThem";

interface NewComponentCopyRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const NewComponentCopyRoot = React.forwardRef<
  HTMLElement,
  NewComponentCopyRootProps
>(function NewComponentCopyRoot(
  { className, ...otherProps }: NewComponentCopyRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex h-full w-full flex-col items-start gap-4",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <ChatSent
        name="You"
        message="Summarize this client's health history"
        timestamp=""
      />
      <ChatBubbleThem
        time=""
        avatar={
          <Avatar image="https://res.cloudinary.com/subframe/image/upload/v1711487219/uploads/132/tflbg5xz6alwt0gc69ss.png">
            A
          </Avatar>
        }
        name="Bot"
        message="On the client's paternal side, there's a history of heart disease. Their grandfather passed away from a heart attack in his early 70s and their father has been diagnosed with high blood pressure, although it is managed with medication and diet. The client's paternal aunts and uncles have no known heart-related conditions. [claim_2.pdf]"
      />
    </div>
  );
});

export const NewComponentCopy = NewComponentCopyRoot;
