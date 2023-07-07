/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Spinner, Modal, TextInput, Label } from "flowbite-react";
import React from "react";
import { useState } from "react";
import { useModalContext } from "../../context/ModalContext";
import useDrivePicker from "react-google-drive-picker";
const PSYCHIC_URL = process.env.REACT_APP_PSYCHIC_URL;

interface GDriveMetadataFormProps {
  creds: string | null;
  onSubmit: () => void;
}

const GDriveMetadataForm: React.FC<GDriveMetadataFormProps> = ({
  creds,
  onSubmit,
}) => {
  const {
    selectedConnectorId,
    setIsLoading,
    setMetadata,
    publicKey,
    accountId,
  } = useModalContext();
  const [folderName, setFolderName] = useState([]);

  const [loading, setLoading] = useState(false);

  const [openPicker, authResponse] = useDrivePicker();

  const handleOpenPicker = () => {
    if (!creds) {
      return;
    }
    const credsJson = JSON.parse(creds);

    // appId is the first part of client_id when separated by a -
    const appId = credsJson.client_id.split("-")[0];

    openPicker({
      appId: appId,
      clientId: credsJson.client_id,
      developerKey: credsJson.developer_key,
      // Mimetypes should be docs and pdfs
      viewMimeTypes:
        "application/vnd.google-apps.document,application/pdf,application/vnd.google-apps.folder",
      token: credsJson.access_token, // pass oauth token in case you already have one
      showUploadView: false,
      showUploadFolders: false,
      supportDrives: true,
      multiselect: true,
      setSelectFolderEnabled: true,
      customScopes: ["https://www.googleapis.com/auth/drive.file"],
      // customViews: customViewsArray, // custom view
      callbackFunction: (data: any) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        if (data.action === "picked") {
          var sections = [];
          for (var i = 0; i < data.docs.length; i++) {
            var type = data.docs[i].type === "folder" ? "folder" : "document";
            sections.push({
              name: data.docs[i].name,
              id: data.docs[i].id,
              type: type,
            });
          }
          setFolderMetadata(sections);
        }
      },
    });
  };

  async function setFolderMetadata(sections: any) {
    // call /update-connection-metadata endpoint with folderId
    setLoading(true);
    const response = await fetch(`${PSYCHIC_URL}/add-section-filter-public`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicKey}`,
      },
      body: JSON.stringify({
        connector_id: selectedConnectorId,
        account_id: accountId,
        section_filter: {
          id: "__default__",
          sections: sections,
        },
      }),
    });

    const data = await response.json();
    setLoading(false);

    onSubmit();
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        size="xl"
        className="w-3/5 min-w-300 mb-4"
        onClick={handleOpenPicker}
      >
        {loading ? <Spinner className="mr-2" /> : "Select Files or Folders"}
      </Button>
    </div>

    // <div>
    //     <Button onClick={handleOpenPicker}>Open Picker2</Button>
    // </div>
  );
};

export default GDriveMetadataForm;
