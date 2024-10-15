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
import ReactPlayer from 'react-player';
import { Loader } from "@/subframe/components/Loader";


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
  const { getSessionRecordingUrl, error, isLoading } = useFinicApp();
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
  const [args, setArgs] = React.useState<string>("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (sessionId && isOpen) {
      getSessionRecordingUrl(sessionId).then((url) => {
        setUrl(url);
      });
    }
  }, [sessionId, isOpen]);

  return (
    <DialogLayout open={isOpen}>
      <div className="flex h-full w-full min-w-[800px] flex-col items-start gap-8 bg-default-background px-8 py-8">
        <div className="flex w-full items-center justify-between">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Session Recording
          </span>
          <IconButton
            icon="FeatherX"
            onClick={() => {
              setIsOpen(false);
            }}
          />
        </div>

        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls={true}
        />

        {error && (
          <Alert
            variant="error"
            icon="FeatherAlertCircle"
            title="Error"
            description={error.message}
          />
        )}

      </div>
    </DialogLayout>
  );
}
