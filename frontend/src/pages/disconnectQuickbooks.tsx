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
import { getUsername } from "../utils";
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
import Nango from "@nangohq/frontend";

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});
init("8f535b4f-a447-4278-b242-bd77d408f7e2");

function DisconnectQuickbooks() {
  // get parameters from the URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id") || "test";

  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const result = await getUsername(id);
      setUsername(result);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full flex-col items-center gap-4 bg-default-background pt-12 pr-40 pb-12 pl-40">
        <div className="flex w-144 flex-col items-start gap-9">
          <div className="flex w-full flex-col items-start">
            <span className="w-full text-section-header font-section-header text-default-font">
              Successfuly disconnected Quickbooks
            </span>
            <span className="w-full text-body font-body text-subtext-color">
              You have successfully disconnected your Quickbooks account from
              Dealwise.
            </span>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default DisconnectQuickbooks;
