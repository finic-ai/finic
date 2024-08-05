"use client";
/*
 * Documentation:
 * New Component — https://app.subframe.com/cb0b7d209a24/library?component=New+Component_c5157938-0546-4473-bc66-64920f95bdfd
 * Chat Sent — https://app.subframe.com/cb0b7d209a24/library?component=Chat+Sent_8206bfc1-a590-434f-9706-c81a8bc60827
 * Avatar — https://app.subframe.com/cb0b7d209a24/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 * Chat Bubble Them — https://app.subframe.com/cb0b7d209a24/library?component=Chat+Bubble+Them_5fa1557c-fe15-4f3e-85e7-470457d52473
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { ChatSent } from "./ChatSent";
import { Avatar } from "./Avatar";
import { ChatBubbleThem } from "./ChatBubbleThem";

interface NewComponentRootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const NewComponentRoot = React.forwardRef<HTMLElement, NewComponentRootProps>(
  function NewComponentRoot(
    { className, ...otherProps }: NewComponentRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex h-full w-full cursor-pointer flex-col items-start gap-2",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-4">
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
          <ChatBubbleThem
            time=""
            avatar={
              <Avatar image="https://res.cloudinary.com/subframe/image/upload/v1711487219/uploads/132/tflbg5xz6alwt0gc69ss.png">
                A
              </Avatar>
            }
            name="Bot"
            message="On the maternal side, diabetes is prevalent. Both the client's mother and aunt were diagnosed with Type 2 diabetes in their 50s. Their maternal grandparents lived into their 80s and 90s but were also diagnosed with Type 2 diabetes. [claim_3.pdf]"
          />
          <ChatBubbleThem
            time=""
            avatar={
              <Avatar image="https://res.cloudinary.com/subframe/image/upload/v1711487219/uploads/132/tflbg5xz6alwt0gc69ss.png">
                A
              </Avatar>
            }
            name="Bot"
            message="As for the client's personal health, they have regular check-ups and maintain a healthy lifestyle to mitigate these inherited risks. Their last physical examination, including blood work, was reported to be all clear. [claim_4.pdf]"
          />
        </div>
      </div>
    );
  }
);

export const NewComponent = NewComponentRoot;
