import React, { useRef } from "react";
import { DialogLayout } from "@/subframe/layouts/DialogLayout";
import { IconButton } from "@/subframe/components/IconButton";
import { TextArea } from "@/subframe/components/TextArea";
import { Switch } from "@/subframe/components/Switch";
import { Button } from "@/subframe/components/Button";
import { Alert } from "@/subframe/components/Alert";
import { Select } from "@/subframe/components/Select";
import useFinicApp from "@/hooks/useFinicApp";
import { Execution } from "@/types";

interface SessionRecordingModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  sessionId: string | null;
}

export default function SessionRecordingModal({
  isOpen,
  sessionId,
  setIsOpen,
}: SessionRecordingModalProps) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [args, setArgs] = React.useState<string>("");
  const dialogRef = useRef<HTMLDivElement>(null);

  return (
    <DialogLayout open={isOpen}>
      <div className="flex h-full w-full min-w-[576px] flex-col items-start gap-8 bg-default-background px-8 py-8">
        <div className="flex w-full items-center justify-between">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Run Agent
          </span>
          <IconButton
            icon="FeatherX"
            onClick={() => {
              setIsOpen(false);
            }}
          />
        </div>
        <div className="flex w-full min-w-[384px] max-w-[576px] grow shrink-0 basis-0 flex-col flex-wrap items-start gap-4">
          <TextArea
            className="h-auto w-full flex-none outline-none focus:outline-none ring-0 focus:ring-0"
            error={false}
            variant="outline"
            label="Arguments (JSON format)"
            helpText="These will be passed to your agent's main function as arguments. If left blank, no arguments will be passed."
          >
            <TextArea.Input
              className="h-auto min-h-[128px] w-full flex-none outline-none focus:outline-none ring-0 focus:ring-0"
              placeholder={
                '{\n  "openai_api_key": "<api-key>",\n  "server_url": "https://api.example.com/",\n  "product_id": "001777c8-8c9b-4dcb-b062-fe5960d13470"\n}'
              }
              value={args}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setArgs(event.target.value);
              }}
            />
          </TextArea>
        </div>
        {errorMessage == null ? null : (
          <Alert
            variant="error"
            icon="FeatherAlertCircle"
            title="Error"
            description={errorMessage}
          />
        )}

      </div>
    </DialogLayout>
  );
}
