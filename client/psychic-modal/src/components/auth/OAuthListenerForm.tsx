/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Spinner, Modal, TextInput, Label } from "flowbite-react";
import React, { useEffect, useCallback, useRef } from "react";
import { useState } from "react";
import { useModalContext } from "../../context/ModalContext";

// Subdomain props
interface OAuthListenerFormProps {
  onSubmit: (code: string) => void;
}

const OAuthListenerForm: React.FC<OAuthListenerFormProps> = ({ onSubmit }) => {
  const {
    selectedConnectorId,
    connectorName,
    setMetadata,
    startConnectorAuthFlow,
  } = useModalContext();
  const [authCode, setAuthCode] = useState(null);
  const authCodeHandled = useRef(false);
  console.log("oauth listener form ");

  useEffect(() => {
    // Add event listeners to get auth codes
    console.log("adding event listener");
    window.addEventListener("message", handleMessage, false);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleMessage = (event: MessageEvent) => {
    // check if oigin is not http://localhost:5173 or link.psychic.dev
    console.log(event.origin);
    const data = event.data;
    if (data && data.psychic_link && data.code && !authCodeHandled.current) {
      authCodeHandled.current = true;
      onSubmit(data.code);
    }
  };

  return (
    <div className="space-y-6 px-8">
      <div className="text-center">
        <div className="text-center">
          <Spinner size="xl" />
        </div>
        <p className="mt-6">
          Authenticating with <span className="font-bold">{connectorName}</span>
          ...
        </p>
      </div>
    </div>
  );
};

export default OAuthListenerForm;
