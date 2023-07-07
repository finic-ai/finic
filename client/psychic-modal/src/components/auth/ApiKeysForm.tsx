/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Spinner, Modal, TextInput, Label } from "flowbite-react";
import React from "react";
import { useState } from "react";
import { useModalContext } from "../../context/ModalContext";

// Subdomain props
interface SubdomainMetadataFormProps {
  onSubmit: (email: string, apiKey: string) => void;
  emailRequired: boolean;
  appName: string;
  loading: boolean;
}

const ApiKeysForm: React.FC<SubdomainMetadataFormProps> = ({
  onSubmit,
  emailRequired,
  appName,
  loading,
}) => {
  const {
    selectedConnectorId,
    setIsLoading,
    setMetadata,
    startConnectorAuthFlow,
  } = useModalContext();
  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div>
      {emailRequired ? (
        <>
          <Label htmlFor="apiKeys.label">{appName} email</Label>
          <TextInput
            id="apiKeys.label"
            name="apiKeys.label"
            placeholder={`The email address of your ${appName} admin account`}
            className="mt-1"
            onChange={(e) => setEmail(e.target.value.trim())}
            value={email}
            helperText={`Enter the email address of your ${appName} admin account which you used to generate the API key`}
          />
        </>
      ) : (
        <></>
      )}

      <Label htmlFor="apiKeys.label">{appName} API key</Label>
      <TextInput
        id="apiKeys.label"
        name="apiKeys.label"
        placeholder={`Your ${appName} API key`}
        className="mt-1"
        onChange={(e) => setApiKey(e.target.value.trim())}
        value={apiKey}
        helperText={`The API key you generated in your ${appName} admin account.`}
      />

      <div className="flex justify-center">
        <Button
          disabled={!((!emailRequired || email) && apiKey)}
          size="xl"
          className="mb-6 mt-4 w-3/5 min-w-300 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onSubmit(email, apiKey)}
        >
          {loading ? <Spinner className="mr-2" /> : "Set API key"}
        </Button>
      </div>
    </div>
  );
};

export default ApiKeysForm;
