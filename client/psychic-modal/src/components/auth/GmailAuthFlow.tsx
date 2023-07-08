import { Button, Spinner } from "flowbite-react";

import { useModalContext } from "../../context/ModalContext";
import React, { useState } from "react";
import OAuthListenerForm from "./OAuthListenerForm";
import ErrorIcon from "../icons/ErrorIcon";
import SuccessIcon from "../icons/SuccessIcon";

const GmailAuthFlow: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    selectedConnectorId,
    connectorName,
    accountId,
    publicKey,
    metadata,
    setIsLoading,
    isSuccess,
    setIsSuccess,
    isLoading,
    error,
    setError,
    authorizeConnection,
    setNewConnection,
  } = useModalContext();

  const [authFlowStep, setAuthFlowStep] = useState(0);
  const [creds, setCreds] = useState(null);
  const [connection, setConnection] = useState<any>(null);

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
    if (window.opener) {
      result.connection.psychic_link = true;
      window.opener.postMessage(result.connection, "*");
    }
  }

  const renderModalBody = () => {
    switch (authFlowStep) {
      case 0:
        return (
          <OAuthListenerForm
            onSubmit={async (code: string) => {
              setIsLoading(true);
              await completeAuthWithCode(selectedConnectorId, code);
              setAuthFlowStep(authFlowStep + 1);
            }}
          />
        );

      case 1:
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

    if (authFlowStep === 1 && isSuccess) {
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
      {renderModalFooter()}
    </div>
  );
};

export default GmailAuthFlow;
