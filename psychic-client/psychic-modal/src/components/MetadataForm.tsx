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

import ModalHeader, { withModalHeaderProps } from "./ModalHeader";

import SuccessIcon from "./icons/SuccessIcon";
import ErrorIcon from "./icons/ErrorIcon";

interface MetadataFormProps {
    selectedConnectorId: string,
    setMetadata: Function,
}

const MetadataForm: React.FC<MetadataFormProps> = ({selectedConnectorId, setMetadata}) => {

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
            <Button disabled={!folderName} size="xl" className="mb-6 mt-4 w-3/5 min-w-300 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setMetadata({'folder_name': folderName}) } >
                Set folder
            </Button>
            </div>
        </div>
    )
}

export default MetadataForm