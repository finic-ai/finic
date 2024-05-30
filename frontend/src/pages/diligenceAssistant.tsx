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
import { getDiligenceDocs } from "../utils";
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

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});
init("8f535b4f-a447-4278-b242-bd77d408f7e2");

const NewComponent = () => {
  return <h1>Hello, I'm the new React component!</h1>;
};

function DiligenceAssistant() {
  const [loadingLender, setLoadingLender] = useState<string | null>(null);
  const [file];
  const contextRef = useRef<FormContext>(null);
  const navigate = useNavigate();

  const [applications, setApplications] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // formCompletion is a state but of function type
  const [formCompletion, setFormCompletion] = useState(() => () => {});

  const { bearer, email, userId, firstName } = useUserStateContext();

  const [messages, setMessages] = useState([
    {
      message: `Hello ${firstName}! I'm the Dealwise Due Diligence assistant. How can I help you today?`,
      isUser: false,
    },
  ]);

  useEffect(() => {
    async function fetchDocs() {
      const response = await getDiligenceDocs(bearer);
      const filepaths = response.filepaths;
      const vectorized = response.vectorized;
      setApplications(applications);
    }
    fetchDocs();
  }, []);

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

        <ChatWindow messages={messages} submitMessage={submitMessage} />
      </div>
    </DefaultPageLayout>
  );
}

export default DiligenceAssistant;
