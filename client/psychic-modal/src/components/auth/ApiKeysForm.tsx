/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Button,
    Spinner,
    Modal,
    TextInput,
    Label,
    
} from "flowbite-react";
import React from "react";
import { useState } from "react";
import { useModalContext } from "../../context/ModalContext";

import SuccessIcon from "../icons/SuccessIcon";
import ErrorIcon from "../icons/ErrorIcon";

// Subdomain props
interface SubdomainMetadataFormProps {
    onSubmit: (email: string, apiKey: string) => void
}

const ApiKeysForm: React.FC<SubdomainMetadataFormProps> = ({onSubmit}) => {
    const {selectedConnectorId, setIsLoading, setMetadata, startConnectorAuthFlow} = useModalContext()
    const [apiKey, setApiKey] = useState('')
    const [email, setEmail] = useState('')

    return(
        <div>
            <Label htmlFor="apiKeys.label">Zendesk email</Label>
            <TextInput
                id="apiKeys.label"
                name="apiKeys.label"
                placeholder='The email address of your Zendesk admin account'
                className="mt-1"
                onChange={(e) => setEmail(e.target.value.trim())}
                value={email}
                helperText="Enter the email address of your Zendesk admin account which you used to generate the API key"
            />

            <Label htmlFor="apiKeys.label">Zendesk API key</Label>
            <TextInput
                id="apiKeys.label"
                name="apiKeys.label"
                placeholder='Your Zendesk API key'
                className="mt-1"
                onChange={(e) => setApiKey(e.target.value.trim())}
                value={apiKey}
                helperText="The API key you generated in your Zendesk admin account"
            />

            <div className="flex justify-center">
            <Button disabled={!(email && apiKey)} size="xl" className="mb-6 mt-4 w-3/5 min-w-300 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => 
                onSubmit(email, apiKey)} >
                Set API key
            </Button>
            </div>
        </div>
    )
}

export default ApiKeysForm