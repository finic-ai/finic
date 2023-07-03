/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Spinner, Modal, TextInput, Label } from "flowbite-react";
import React from "react";
import { useState } from "react";
import { useModalContext } from "../../context/ModalContext";

// Subdomain props
interface SubdomainMetadataFormProps {
  onSubmit: (subdomain: string) => void;
}

const SubdomainMetadataForm: React.FC<SubdomainMetadataFormProps> = ({
  onSubmit,
}) => {
  const {
    connectorName,
    selectedConnectorId,
    setMetadata,
    metadata,
    startConnectorAuthFlow,
  } = useModalContext();
  const initialValue = metadata ? metadata["subdomain"] : "";
  const [subdomain, setSubdomain] = useState(initialValue || "");

  var helperText = "";
  if (selectedConnectorId === "zendesk") {
    helperText = `Enter your ${connectorName} subdomain, e.g. 'mycompany' for 'mycompany.zendesk.com'`;
  } else if (selectedConnectorId === "confluence") {
    helperText = `Enter your ${connectorName} subdomain, e.g. 'mycompany' for 'mycompany.atlassian.net'`;
  }

  function getSubdomainLabel() {
    if (selectedConnectorId === "zendesk") {
      return `https://${subdomain}.zendesk.com`;
    } else if (selectedConnectorId === "confluence") {
      return `https://${subdomain}.atlassian.net`;
    }
  }

  return (
    <div>
      <Label htmlFor="apiKeys.label">{connectorName} subdomain</Label>
      <TextInput
        id="apiKeys.label"
        name="apiKeys.label"
        placeholder={`Your ${connectorName} subdomain`}
        className="mt-1"
        onChange={(e) => setSubdomain(e.target.value.trim())}
        value={subdomain}
        helperText={helperText}
      />
      <div>
        {subdomain && subdomain.length > 0 && (
          <div className="flex justify-center">
            {/* a label with the full subdomain url */}
            <Label htmlFor="apiKeys.label">
              Your subdomain: {getSubdomainLabel()}
            </Label>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <Button
          disabled={!subdomain}
          size="xl"
          className="mb-6 mt-4 w-3/5 min-w-300 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onSubmit(subdomain)}
        >
          Set subdomain
        </Button>
      </div>
    </div>
  );
};

export default SubdomainMetadataForm;
