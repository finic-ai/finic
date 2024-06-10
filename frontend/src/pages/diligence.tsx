import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../App.css";
import useLocalStorage from "../useLocalStorage";
import { redirect, useLocation } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { UserStateProvider } from "../context/UserStateContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { Root } from "@subframe/core/dist/cjs/components/progress";
import posthog from "posthog-js";
import { Widget } from "@typeform/embed-react";
import { Loader } from "@/subframe/components/Loader";
import { Spinner } from "flowbite-react";
import {
  init,
  Form,
  setFieldValues,
  FormContext,
  updateUserId,
} from "@feathery/react";
import { SubframeSides } from "@subframe/core/dist/cjs/assets/icons/final";
import {
  getQuickbooksStatus,
  getDiligenceDocUploadStatus,
  uploadDiligenceDocuments,
  generateProofOfCash,
} from "../utils";
import { useUserStateContext } from "../context/UserStateContext";
import { DefaultPageLayout } from "../subframe";
import { Avatar } from "@/subframe/components/Avatar";
import { Table } from "@/subframe/components/Table";
import { Badge } from "@/subframe/components/Badge";
import { Button } from "@/subframe/components/Button";
import { Dialog } from "@/subframe/components/Dialog";
import { IconWithBackground } from "@/subframe/components/IconWithBackground";
import { LinkButton } from "@/subframe/components/LinkButton";
import ChatWindow from "../chatComponents/chatWindow";
import WebViewer from "@pdftron/webviewer";
import * as SubframeCore from "@subframe/core";
import { CopyToClipboardField } from "@/subframe/components/CopyToClipboardField";

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});
init("8f535b4f-a447-4278-b242-bd77d408f7e2");

function ConnectQuickbooks({
  loading,
  connected,
  userId,
}: {
  loading: boolean;
  connected: boolean;
  userId: string;
}) {
  return (
    <div className="flex flex-col w-[600px] items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default">
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full flex-col items-start">
          <div className="flex items-center gap-2">
            <SubframeCore.Icon
              className="text-subheader font-subheader text-default-font"
              name="FeatherLink"
            />
            <span className="text-subheader font-subheader text-default-font">
              Connect Quickbooks
            </span>
          </div>
          <span className="text-body font-body text-subtext-color">
            Send this link to the seller so that they can connect their
            Quickbooks account.
          </span>
        </div>
        <CopyToClipboardField
          className="h-auto w-full flex-none"
          text={`https://app.godealwise.com/quickbooks?id=${userId}`}
        />
      </div>
      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-300" />
      <div className="flex h-full w-full grow shrink-0 basis-0 items-center gap-2">
        <div className="flex h-full w-full grow shrink-0 basis-0 items-start justify-between">
          <span className="text-body-bold font-body-bold text-default-font">
            Status:
          </span>
        </div>
        {!loading && connected && (
          <div className="flex items-center gap-1">
            <span className="text-body-bold font-body-bold text-brand-700">
              Connected
            </span>
            <SubframeCore.Icon
              className="text-body-bold font-body-bold text-brand-700"
              name="FeatherCheck"
            />
          </div>
        )}
        {!loading && !connected && (
          <div className="flex items-center gap-1">
            <span className="text-body-bold font-body-bold text-neutral-500">
              Not connected
            </span>
            <SubframeCore.Icon
              className="text-body-bold font-body-bold text-neutral-500"
              name="FeatherX"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function UploadBankStatements({
  loading,
  uploaded,
  onUpload,
}: {
  loading: boolean;
  uploaded: boolean;
  // async func to upload files that takes in a file and returns a promise
  onUpload: (files: Array<File>, filenames: Array<string>) => Promise<void>;
}) {
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  return (
    <div className="flex flex-col w-[600px] items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6 shadow-default">
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full flex-col items-start">
          <div className="flex items-center gap-2">
            <SubframeCore.Icon
              className="text-subheader font-subheader text-default-font"
              name="FeatherFile"
            />
            <span className="text-subheader font-subheader text-default-font">
              Upload Bank Statements
            </span>
          </div>
          <span className="text-body font-body text-subtext-color">
            Upload the past 12 months of bank statements for the seller's
            business.
          </span>
        </div>
        <Button
          onClick={() => {
            setShowUpload(true);
          }}
          loading={uploading}
          variant="neutral-secondary"
          className="w-full mt-3 mb-2"
        >
          Upload
        </Button>
      </div>
      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-300" />
      <div className="flex h-full w-full grow shrink-0 basis-0 items-center gap-2">
        <div className="flex h-full w-full grow shrink-0 basis-0 items-start justify-between">
          <span className="text-body-bold font-body-bold text-default-font">
            Status:
          </span>
        </div>
        {!loading && uploaded && (
          <div className="flex items-center gap-1">
            <span className="text-body-bold font-body-bold text-brand-700">
              Uploaded
            </span>
            <SubframeCore.Icon
              className="text-body-bold font-body-bold text-brand-700"
              name="FeatherCheck"
            />
          </div>
        )}
        {!loading && !uploaded && (
          <div className="flex items-center gap-1">
            <span className="text-body-bold font-body-bold text-neutral-500">
              Missing files
            </span>
            <SubframeCore.Icon
              className="text-body-bold font-body-bold text-neutral-500"
              name="FeatherX"
            />
          </div>
        )}
        <Form
          formId="6dThW7"
          popupOptions={{
            show: showUpload,
            onHide: () => setShowUpload(false),
          }}
          onAction={async (context) => {
            if (
              context.trigger.id !== "3df3cb30-63c2-433f-9d6f-75578a0bdd3e" ||
              (context as any).beforeClickActions
            ) {
              return;
            }
            console.log(context);
            setUploading(true);
            setShowUpload(false);

            const fields = context.fields;
            const fieldNames = [
              "june_2023",
              "july_2023",
              "august_2023",
              "september_2023",
              "october_2023",
              "november_2023",
              "december_2023",
              "january_2024",
              "february_2024",
              "march_2024",
              "april_2024",
              "may_2024",
            ];
            var files: File[] = [];
            for (const fieldName of fieldNames) {
              const value = fields[fieldName].value as Promise<File>[];
              if (value.length > 0) {
                const file = await value[0];
                console.log(file);
                files.push(file);
              }
            }
            await onUpload(files, fieldNames);
            setUploading(false);
          }}
        />
      </div>
    </div>
  );
}

function DiligenceAssistant() {
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState<boolean>(false);

  const [uploaded, setUploaded] = useState<boolean>(false);
  // formCompletion is a state but of function type
  const [generating, setGenerating] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { bearer, email, userId, firstName } = useUserStateContext();

  async function onUpload(files: Array<File>, fileNames: Array<string>) {
    console.log(files);
    await uploadDiligenceDocuments(bearer, userId, files, fileNames);
    await getDocumentUploadStatus();
  }

  async function getDocumentUploadStatus() {
    const response = await getDiligenceDocUploadStatus(bearer);
    console.log(response);
    if (response.uploaded) {
      setUploaded(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    async function getConnectionStatus() {
      const response = await getQuickbooksStatus(bearer);
      if (response.connected) {
        setConnected(true);
      }
    }

    async function updateState() {
      await getConnectionStatus();
      await getDocumentUploadStatus();
      setLoading(false);
    }

    updateState();
    if (userId) updateUserId(userId, true);
  }, []);

  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full flex-col items-start gap-4 bg-default-background pt-12 pr-40 pb-12 pl-40">
        <div className="flex w-full flex-col items-start gap-9">
          <div className="flex w-full flex-col items-start">
            <span className="w-full text-section-header font-section-header text-default-font">
              Proof of Cash
            </span>
            <span className="w-full text-body font-body text-subtext-color">
              Connect the seller's Quickbooks and upload their bank statements
              to get a preliminary proof of cash.
            </span>
          </div>

          <div className="flex flex-row items-center gap-4">
            <ConnectQuickbooks
              loading={loading}
              connected={connected}
              userId={userId}
            />
            <UploadBankStatements
              loading={loading}
              uploaded={uploaded}
              onUpload={onUpload}
            />
          </div>
          {/* Centered brand primary button Generate Proof of Cash */}
          <Button
            disabled={loading || !connected || !uploaded}
            loading={generating}
            onClick={async () => {
              setGenerating(true);
              await generateProofOfCash(bearer);
              setGenerating(false);
              setDialogOpen(true);
            }}
            variant="brand-primary"
            className="w-full mt-3 mb-2"
          >
            Generate Proof of Cash
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Content className="h-auto w-auto flex-none">
              <div className="flex max-w-[384px] flex-col items-start gap-6 pt-6 pr-6 pb-6 pl-6">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <IconWithBackground
                      variant="success"
                      size="large"
                      icon="FeatherSend"
                    />
                    <span className="text-subheader font-subheader text-default-font">
                      Request Submitted
                    </span>
                    <span className="text-body font-body text-default-font">
                      {`Your request for a proof of cash statement is currently processing. When complete, you will receive a email at ${email} with the report.`}
                    </span>
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <Button
                      className="h-8 w-full grow shrink-0 basis-0"
                      variant="brand-primary"
                      size="medium"
                      onClick={() => {
                        setDialogOpen(false);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </Dialog.Content>
          </Dialog>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default DiligenceAssistant;
