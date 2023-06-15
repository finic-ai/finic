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
import { useModalContext } from "../../context/ModalContext";
import useDrivePicker from 'react-google-drive-picker'
import SuccessIcon from "../icons/SuccessIcon";
import ErrorIcon from "../icons/ErrorIcon";
const PSYCHIC_URL = process.env.REACT_APP_PSYCHIC_URL



interface GDriveMetadataFormProps {
    creds: string | null;
    onSubmit: () => void
}

const GDriveMetadataForm: React.FC<GDriveMetadataFormProps> = ({creds, onSubmit}) => {
    const {selectedConnectorId, setIsLoading, setMetadata, publicKey, accountId} = useModalContext()
    const [folderName, setFolderName] = useState('')

    const [loading, setLoading] = useState(false)

    const [openPicker, authResponse] = useDrivePicker(); 

    const handleOpenPicker = () => {
        if (!creds) {
            return 
        }
        const credsJson = JSON.parse(creds)

        openPicker({
          clientId: credsJson.client_id,
          developerKey: credsJson.developer_key,
          viewId: "FOLDERS",
          token: credsJson.access_token, // pass oauth token in case you already have one
          showUploadView: false,
          showUploadFolders: false,
          supportDrives: true,
          multiselect: false,
          setSelectFolderEnabled: true,
          // customViews: customViewsArray, // custom view
          callbackFunction: (data: any) => {
            if (data.action === 'cancel') {
              console.log('User clicked cancel/close button')
            }
            if (data.action === 'picked') {
                var folderId = data.docs[0].id
                setFolderMetadata(folderId)
            }


            console.log(data)
          },
        })
      }

      async function setFolderMetadata(folderId: string) {
        // call /update-connection-metadata endpoint with folderId
        setLoading(true)
        const response = await fetch(`${PSYCHIC_URL}/update-connection-metadata`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicKey}`
            },
            body: JSON.stringify({
                connector_id: selectedConnectorId,
                account_id: accountId,
                metadata: {
                    folder_id: folderId
                }
            })
        })

        const data = await response.json()
        setLoading(false)

        onSubmit()
    }


    return(
        <div className="flex flex-col items-center"> 
        <Button  size="xl" className="w-3/5 min-w-300 mb-4" onClick={handleOpenPicker}>
            {loading ? <Spinner className="mr-2" /> : 'Select Folder'}
            
        </Button>
        </div>

        // <div>
        //     <Button onClick={handleOpenPicker}>Open Picker2</Button>
        // </div>
    )
}

export default GDriveMetadataForm