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
import Field from "@feathery/react/dist/utils/api/Field";
import { SubframeSides } from "@subframe/core/dist/cjs/assets/icons/final";
import { getDiligenceDocs, downloadFile } from "../utils";
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

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});
init("8f535b4f-a447-4278-b242-bd77d408f7e2");

const NewComponent = () => {
  return <h1>Hello, I'm the new React component!</h1>;
};

function DiligenceAssistant() {
  const [loading, setLoading] = useState<boolean>(true);
  const [doc, setDoc] = useState<any>(null);
  const [file, setFile] = useState<string | null>(null);
  const contextRef = useRef<FormContext>(null);
  const navigate = useNavigate();
  const viewer = useRef<any>(null);

  const [applications, setApplications] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // formCompletion is a state but of function type
  const [formCompletion, setFormCompletion] = useState(() => () => {});
  const [docViewer, setDocViewer] = useState<any>(null);

  const { bearer, email, userId, firstName } = useUserStateContext();

  // array of { message: string; isUser: boolean; }'
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDocs() {
      const response = await getDiligenceDocs(bearer, false);
      console.log(response);
      console.log(response);
      setLoading(false);
      setDoc(response.doc);
      setApplications(applications);
    }
    fetchDocs();
    console.log("viewer", viewer.current);
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
  }, []);

  useEffect(() => {
    async function updateFile() {
      if (doc && doc.filepath && !file) {
        console.log("downloading file");
        const file = await downloadFile(doc.filepath);
        setFile(file);
      }
      if (doc && doc.processing_state != "PROCESSED") {
        setMessages([
          {
            message: "Your CIM is being processed. Please wait.",
            isUser: false,
            loading: true,
          },
        ]);
        if (
          doc.processing_state == "PROCESSING" ||
          doc.processing_state == "QUEUED"
        ) {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          const response = await getDiligenceDocs(bearer, false);
          setDoc(response.doc);
        } else if (doc.processing_state == "NOT_STARTED") {
          const response = await getDiligenceDocs(bearer, true);
          setDoc(response.doc);
        }
      } else if (doc && doc.processing_state == "PROCESSED") {
        setMessages([
          {
            message:
              "Your CIM has been processed. I can help you with any questions you have about the business.",
            isUser: false,
            loading: false,
          },
        ]);
      }
    }
    updateFile();
  }, [doc]);

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

  async function submitMessage(message: string) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message,
        isUser: true,
      },
      { message: "Loading...", isUser: false, loading: true },
    ]);
  }

  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full flex-col items-start gap-4 bg-default-background pt-12 pr-40 pb-12 pl-40">
        <span className="text-subheader font-subheader text-default-font">
          Diligence Assistant
        </span>

        <>
          {/* side by side */}
          <div className="flex flex-row w-full gap-4">
            {!loading && doc && (
              <ChatWindow messages={messages} submitMessage={submitMessage} />
            )}
            <div className="w-full h-[80vh] flex-grow" ref={viewer}></div>
          </div>
        </>
      </div>
    </DefaultPageLayout>
  );
}

export default DiligenceAssistant;
