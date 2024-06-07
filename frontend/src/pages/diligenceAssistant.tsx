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
  getDiligenceDocs,
  downloadFile,
  uploadDiligenceDocument,
  chat,
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

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});
init("8f535b4f-a447-4278-b242-bd77d408f7e2");

const UploadDocument = ({ onUpload }: { onUpload: any }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file);
      setLoading(true);
      onUpload(file);
      // Handle the file upload process here
    }
  };

  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-brand-primary bg-brand-50 pt-12 pr-12 pb-12 pl-12 cursor-pointer"
      onClick={handleClick}
    >
      {loading ? (
        <div>
          <Loader /> Uploading your file
        </div>
      ) : (
        <>
          <SubframeCore.Icon
            className="text-section-header font-section-header text-brand-700"
            name="FeatherUpload"
          />
          <span className="text-body-bold font-body-bold text-brand-700">
            Click to upload CIM
          </span>
          <span className="text-body font-body text-brand-700">
            The Dealwise diligence assistant answers your questions using your
            CIM.
          </span>
          <span className="text-label font-label text-brand-700">Max 10MB</span>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf"
          />
        </>
      )}
    </div>
  );
};

function ChatInterface({
  file,
  doc,
  bearer,
}: {
  file: any;
  doc: any;
  bearer: any;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [docViewer, setDocViewer] = useState<any>(null);
  const viewer = useRef<any>(null);

  useEffect(() => {
    WebViewer(
      {
        path: "/public",
        licenseKey: import.meta.env.VITE_APRYSE_API_KEY,
        // initialDoc:
        //   "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf",
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer } = instance.Core;
      setDocViewer(documentViewer);
      // you can now call WebViewer APIs here...
      // documentViewer.loadDocument()
    });
  }, [viewer]);

  useEffect(() => {
    async function loadDoc() {
      if (docViewer && file) {
        docViewer.loadDocument(file);
        // wait 5 seconds for the document to load
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        // docViewer.setCurrentPage(10);
      }
    }
    loadDoc();
  }, [docViewer, file]);

  useEffect(() => {
    async function setInitialMessage() {
      if (doc.processing_state != "PROCESSED") {
        setMessages([
          {
            text: "Your CIM is being processed. Please wait.",
            sender: "ASSISTANT",
            loading: true,
          },
        ]);
      } else if (doc.processing_state == "PROCESSED") {
        setMessages([
          {
            text: "Your CIM has been processed. I can help you with any questions you have about the business.",
            sender: "ASSISTANT",
            loading: false,
          },
        ]);
      }
    }
    setInitialMessage();
  }, [doc]);

  async function submitMessage(message: string) {
    var newMessages = [...messages, { text: message, sender: "USER" }];
    setMessages([
      ...newMessages,
      { text: "", sender: "ASSISTANT", loading: true },
    ]);
    const response = await chat(bearer, newMessages);
    // Remove the loading message and add the response
    console.log(response);
    if (response && response.response) {
      var sources = response.cited_documents || [];
      newMessages.push({
        text: response.response,
        sender: "ASSISTANT",
        sources: sources,
      });
      setMessages(newMessages);
    }
  }

  return (
    <div className="flex flex-row w-full gap-4">
      <ChatWindow
        messages={messages}
        submitMessage={submitMessage}
        onSourceClick={(source) => {
          console.log("source clicked", source);
          docViewer.setCurrentPage(source.page);
        }}
      />
      <div className="w-full h-[80vh] flex-grow" ref={viewer}></div>
    </div>
  );
}

function DiligenceAssistant() {
  const [loading, setLoading] = useState<boolean>(true);
  const [doc, setDoc] = useState<any>(null);
  const [file, setFile] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string>("");

  const contextRef = useRef<FormContext>(null);
  const navigate = useNavigate();

  const [applications, setApplications] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // formCompletion is a state but of function type
  const [formCompletion, setFormCompletion] = useState(() => () => {});

  const { bearer, email, userId, firstName } = useUserStateContext();

  // array of { message: string; isUser: boolean; }'

  useEffect(() => {
    async function fetchDocs() {
      const response = await getDiligenceDocs(bearer, false);
      console.log(response);
      console.log(response);
      setLoading(false);
      setDoc(response.doc);
      setApplications(applications);
      setBusinessId(response.business_id);
    }
    fetchDocs();
  }, []);

  useEffect(() => {
    async function updateFile() {
      if (doc && doc.filepath && !file) {
        console.log("downloading file");
        const file = await downloadFile(doc.filepath);
        setFile(file);
      }
      if (doc && doc.processing_state != "PROCESSED") {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        const response = await getDiligenceDocs(bearer, false);
        setDoc(response.doc);
      }
    }
    updateFile();
  }, [doc]);

  async function uploadFile(file: any) {
    await uploadDiligenceDocument(bearer, userId, businessId, file);
    const response = await getDiligenceDocs(bearer, false);
    setDoc(response.doc);
  }

  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full grow shrink-0 basis-0 flex-col items-start gap-4 bg-default-background pt-12 pr-40 pb-12 pl-40">
        <span className="text-subheader font-subheader text-default-font">
          Diligence Assistant
        </span>

        {!loading && !doc && <UploadDocument onUpload={uploadFile} />}

        {!loading && doc && (
          <ChatInterface bearer={bearer} file={file} doc={doc} />
        )}
      </div>
    </DefaultPageLayout>
  );
}

export default DiligenceAssistant;
