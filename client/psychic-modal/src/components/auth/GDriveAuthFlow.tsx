import { Avatar, Button, Spinner } from "flowbite-react";

import { HiLockClosed, HiEyeSlash } from "react-icons/hi2";
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useModalContext } from "../../context/ModalContext";
import ErrorIcon from "../icons/ErrorIcon";
import SuccessIcon from "../icons/SuccessIcon";
import { start } from "repl";
import MetadataForm from "./GDriveMetadataForm";
import SubdomainMetadataForm from "./SubdomainMetadataForm";
import ApiKeysForm from "./ApiKeysForm";
import OAuthListenerForm from "./OAuthListenerForm";
import { AuthMethod } from "../../context/ModalContext";
import useDrivePicker from "react-google-drive-picker";
import GDriveMetadataForm from "./GDriveMetadataForm";

type Metadata = {
  [key: string]: string | null;
};

const GDriveAuthFlow: React.FC = () => {
  const {
    authCode,
    setAuthCode,
    currentStep,
    setCurrentStep,
    selectedConnectorId,
    connectorName,
    customerLogoUrl,
    accountId,
    publicKey,
    metadata,
    setMetadata,
    setIsLoading,
    isSuccess,
    setIsSuccess,
    isLoading,
    error,
    setError,
    authorizeConnection,
    setNewConnection,
    credential,
    setCredential,
    startConnectorAuthFlow,
  } = useModalContext();

  const [authFlowStep, setAuthFlowStep] = useState(0);
  const [creds, setCreds] = useState(null);
  const [connection, setConnection] = useState<any>(null);

  const renderModalBody = () => {
    switch (authFlowStep) {
      case 0:
        return (
          <OAuthListenerForm
            onSubmit={async (code: string) => {
              setIsLoading(true);
              console.log("completing auth with code ", code);
              await completeAuthWithCode(selectedConnectorId, code);
              setAuthFlowStep(authFlowStep + 1);
            }}
          />
        );

      case 1:
        return (
          <GDriveMetadataForm
            creds={creds}
            onSubmit={() => {
              setAuthFlowStep(authFlowStep + 1);
              if (window.opener) {
                var connection_with_label = connection;
                connection_with_label["psychic_link"] = true;
                window.opener.postMessage(connection_with_label, "*");
              }
            }}
          />
        );

      // return <ApiKeysForm onSubmit={(email: string, apiKey: string) => {
      //   setIsLoading(true)
      //   completeAuthWithCode(selectedConnectorId, email, apiKey)
      //   setAuthFlowStep(authFlowStep + 1)
      // }} />

      case 2:
        console.log("error", error);
        return (
          <>
            {isSuccess && (
              <div className="flex flex-col mb-4 space-y-4 items-center text-center">
                <SuccessIcon />
                <p className="text-gray-600">
                  You have successfully connected to{" "}
                  <span className="font-bold">{connectorName}</span>.
                </p>
              </div>
            )}
            {!isSuccess && (
              <div className="flex flex-col mb-4 space-y-4 items-center text-center">
                <ErrorIcon />
                <div>
                  <p className="text-gray-600">
                    We couldn't connect to{" "}
                    <span className="font-bold">{connectorName}</span>.
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Try it one more time? If it still doesn’t work, contact
                    Psychic support{" "}
                    <a
                      href="mailto:support@psychic.dev"
                      className="underline text-blue-500 hover:text-blue-600"
                    >
                      here
                    </a>{" "}
                    and we’ll fix it.
                  </p>
                </div>
              </div>
            )}
          </>
        );
    }

    async function completeAuthWithCode(connectorId: string, code: string) {
      if (!accountId || !publicKey) {
        setError("Invalid account_id or public_key");
        setIsLoading(false);
        return;
      }
      const result = await authorizeConnection(
        connectorId,
        accountId,
        publicKey,
        code,
        metadata
      );
      console.log("result", result);
      if (!result) {
        setError("Something went wrong. Please try again.");
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }
      setNewConnection(result.connection);
      setCreds(result.connection.credential);
      setConnection(result.connection);
      setIsLoading(false);
      setIsSuccess(true);
      // Notify opening window that auth is complete

      // setAuthFlowStep(authFlowStep + 1)
    }

    return (
      <div className="space-y-6 px-8">
        <div className="text-center">
          <div className="text-center">
            <Spinner size="xl" />
          </div>
          <p className="mt-6">
            Authenticating with{" "}
            <span className="font-bold">{connectorName}</span>...
          </p>
        </div>
      </div>
    );
  };

  const renderModalFooter = () => {
    if (isLoading) {
      return <></>;
    }

    if (authFlowStep === 2 && isSuccess) {
      return (
        <div className="flex flex-col items-center">
          <Button
            size="xl"
            className="w-3/5 min-w-300"
            onClick={() => window.close()}
          >
            Finish
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center">
          <Button
            color="gray"
            size="xl"
            className="w-3/5 min-w-300"
            onClick={() => {
              if (authFlowStep === 0) {
                setCurrentStep(currentStep - 1);
              } else {
                setAuthFlowStep(authFlowStep - 1);
              }
            }}
          >
            Go Back
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="px-8">
      {renderModalBody()}
      {/* {renderResult()} */}
      {renderModalFooter()}
    </div>
  );
};

export default GDriveAuthFlow;
