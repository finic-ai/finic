import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../App.css";
import useLocalStorage from "../useLocalStorage";
import { redirect, useLocation } from "react-router-dom";
import posthog from "posthog-js";
import { Widget } from "@typeform/embed-react";
import { Loader } from "@/subframe/components/Loader";
import { Spinner } from "flowbite-react";
import { init } from "@feathery/react";
import { SubframeSides } from "@subframe/core/dist/cjs/assets/icons/final";
import {
  getUsername,
  getQuickbooksStatus,
  disconnectQuickbooks,
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
import Nango from "@nangohq/frontend";
import QuickBooksButton from "../assets/C2QB_green_btn_tall_default.svg";

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});
init("8f535b4f-a447-4278-b242-bd77d408f7e2");

const nango = new Nango({ publicKey: "dfda7c68-c3c4-414d-9bab-161fee55521b" });

function Quickbooks() {
  // get parameters from the URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id") || "test";

  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const result = await getUsername(id);
      setUsername(result);
      const quickbooksResponse = await getQuickbooksStatus(id);
      setLoading(false);

      console.log(quickbooksResponse);

      if (quickbooksResponse.connected) {
        setComplete(true);
      }
    }
    fetchData();
  }, []);

  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full flex-col items-center gap-4 bg-default-background pt-12 pr-40 pb-12 pl-40">
        <div className="flex w-144 flex-col items-start gap-9">
          {!loading && (
            <>
              <div className="flex w-full flex-col items-start">
                <span className="w-full text-section-header font-section-header text-default-font">
                  Connect QuickBooks
                </span>
                <span className="w-full text-body font-body text-subtext-color">
                  {username} has invited you to connect your QuickBooks for a
                  Quality of Earnings report. Please log in with your QuickBooks
                  account below.
                </span>
              </div>

              <div className="flex w-full flex-col items-center gap-4">
                {complete ? (
                  <Button
                    size="large"
                    loading={disconnecting}
                    onClick={async () => {
                      setDisconnecting(true);
                      const response = await disconnectQuickbooks(id);
                      setDisconnecting(false);
                      console.log(response);
                      setComplete(false);
                    }}
                  >
                    Disconnect QuickBooks
                  </Button>
                ) : (
                  <button
                    disabled={loading || complete}
                    onClick={async () => {
                      setLoading(true);
                      nango
                        .auth("quickbooks", id, {})
                        .then(
                          (result: {
                            providerConfigKey: string;
                            connectionId: string;
                          }) => {
                            // do something
                            console.log(result);

                            setLoading(false);
                            setComplete(true);
                          }
                        )
                        .catch((err: { message: string; type: string }) => {
                          // handle error
                          console.log(err);
                          setLoading(false);
                        });
                    }}
                  >
                    <img src={QuickBooksButton} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default Quickbooks;
