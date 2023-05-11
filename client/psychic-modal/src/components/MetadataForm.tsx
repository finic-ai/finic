/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Button,
    Spinner,
    Modal,
    TextInput,
    Label
} from "flowbite-react";
import React from "react";
import { useState } from "react";
import { useModalContext } from "../context/ModalContext";
import ModalHeader, { withModalHeaderProps } from "./ModalHeader";

import SuccessIcon from "./icons/SuccessIcon";
import ErrorIcon from "./icons/ErrorIcon";



const MetadataForm: React.FC = () => {
    const {selectedConnectorId, setIsLoading, setMetadata, startConnectorAuthFlow} = useModalContext()
    const [folderName, setFolderName] = useState('')

    return(
        <div>
            <Label htmlFor="apiKeys.label">Folder link</Label>
            <TextInput
                id="apiKeys.label"
                name="apiKeys.label"
                placeholder='Link to the folder you want to sync with'
                className="mt-1"
                onChange={(e) => setFolderName(e.target.value.trim())}
                value={folderName}
                helperText="Only files in this Google Drive folder will by synced. You can find the link to the folder in your Google Drive account."
            />
            <div className="flex justify-center">
            <Button disabled={!folderName} size="xl" className="mb-6 mt-4 w-3/5 min-w-300 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => 
                {
                    setIsLoading(true)
                    setMetadata({'folder_url': folderName}) 
                    startConnectorAuthFlow(window, selectedConnectorId)
                }} >
                Set folder
            </Button>
            </div>
        </div>
    )
}

export default MetadataForm