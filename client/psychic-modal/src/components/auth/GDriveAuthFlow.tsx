import {
  Avatar,
  Button,
  Spinner
} from "flowbite-react";

import {
  HiLockClosed,
  HiEyeSlash
} from "react-icons/hi2";
import React from "react";
import { useState, useEffect, useRef, useCallback} from "react";
import { useModalContext } from "../../context/ModalContext";
import SuccessIcon from "../icons/SuccessIcon";
import ErrorIcon from "../icons/ErrorIcon";
import { start } from "repl";
import MetadataForm from "./GDriveMetadataForm";
import SubdomainMetadataForm from "./SubdomainMetadataForm";
import ApiKeysForm from "./ApiKeysForm";
import OAuthListenerForm from "./OAuthListenerForm";
import { AuthMethod } from "../../context/ModalContext";
import useDrivePicker from 'react-google-drive-picker'
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
  startConnectorAuthFlow
} = useModalContext()

const [authFlowStep, setAuthFlowStep] = useState(0)
const [creds, setCreds] = useState(null)

const token = {"token": "ya29.a0AWY7CklAYNHzz8gEbfcvXrS4uW5qENePWBA_x1hwMQXYgLMdnGQf_UNaA2761gf9KN8R7mGKSzwsd8lCBgbDGZcZ6N19JFwir1xOdfG5hsLAb6TU1RbeX0olYu4UGcGXrYIa1gw4Ae3JQ_7pkGgVV9KWWrCGaCgYKAVsSARMSFQG1tDrpslzvNwtb6iOQJ_5jiTJbog0163", "refresh_token": "1//05Vfo66zpUhxBCgYIARAAGAUSNwF-L9IrMpxP7gMpdsxSbGhUJ-dT2rJ-hpU4l_a6AQSmozUBEhWRyrlSNX9EBSBlzWiqevq4DCU", "token_uri": "https://oauth2.googleapis.com/token", "client_id": "521298051240-ju1q0mcufpe1qq0sr4uuvr772b39al4k.apps.googleusercontent.com", "client_secret": "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", "scopes": ["https://www.googleapis.com/auth/drive.readonly"], "expiry": "2023-06-15T04:56:36.956209Z"}
    const clientDetails = {"web":{"client_id":"521298051240-ju1q0mcufpe1qq0sr4uuvr772b39al4k.apps.googleusercontent.com","project_id":"spearmint-fbf84","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["https://link.psychic.dev/oauth/redirect","http://localhost:3000/oauth/redirect","https://app.getsidekick.ai/connectors/google-drive"]}}
    const [openPicker, authResponse] = useDrivePicker(); 

const handleOpenPicker = () => {
  console.log('opening picker')
  openPicker({
    clientId: clientDetails.web.client_id,
    developerKey: "AIzaSyAJqpLDJ2LLpM1oc_eAQuo2H3hCYJQ6UjU",
    viewId: "FOLDERS",
    token: token.token, // pass oauth token in case you already have one
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
      console.log(data)
    },
  })
}


const renderModalBody = () => {

  switch (authFlowStep) {
    case 0:
      return <OAuthListenerForm onSubmit={async (code: string) => {
        setIsLoading(true)
        console.log('completing auth with code ', code)
        await completeAuthWithCode(selectedConnectorId, code)      
        setAuthFlowStep(authFlowStep + 1)    
      }} />

    case 1:
      return <GDriveMetadataForm creds={creds} onSubmit={() => {
        setAuthFlowStep(authFlowStep + 1)
      }}/>

      // return <ApiKeysForm onSubmit={(email: string, apiKey: string) => {
      //   setIsLoading(true)
      //   completeAuthWithCode(selectedConnectorId, email, apiKey)      
      //   setAuthFlowStep(authFlowStep + 1)    
      // }} />

    case 2: 
      console.log('error', error)
      return  (
        <> 
          {isSuccess && <div className="flex flex-col mb-4 space-y-4 items-center text-center">
            <SuccessIcon />
            <p className="text-gray-600">You have successfully connected to <span className="font-bold">{connectorName}</span>.</p>
          </div>}
          {!isSuccess && <div className="flex flex-col mb-4 space-y-4 items-center text-center">
            <ErrorIcon />
            <div>
              <p className="text-gray-600">We couldn't connect to <span className="font-bold">{connectorName}</span>.</p>
              <p className="mt-1 text-sm text-gray-600">Try it one more time? If it still doesn’t work, contact Psychic support <a href="mailto:support@psychic.dev" className="underline text-blue-500 hover:text-blue-600">here</a> and we’ll fix it.</p>
            </div>
          </div>}
        </>
        
      )
  }

  async function completeAuthWithCode(connectorId: string, code: string) {
    if (!accountId || !publicKey) {
      setError('Invalid account_id or public_key')
      setIsLoading(false)
      return
    }
    const result = await authorizeConnection(
        connectorId, 
        accountId, 
        publicKey,
        code,
        metadata
    )
    console.log('result', result)
    if (!result) {
      setError('Something went wrong. Please try again.')
      setIsSuccess(false)
      setIsLoading(false)
      return
    }
    setNewConnection(result.connection)
    setCreds(result.connection.credential)
    setIsLoading(false)
    setIsSuccess(true)
    // Notify opening window that auth is complete
    if (window.opener) {
      window.opener.postMessage(result.connection, '*')
    }
    handleOpenPicker()
    // setAuthFlowStep(authFlowStep + 1)
  }


  return (
    <div className="space-y-6 px-8">
        <div className="text-center">
          <div className="text-center">
            <Spinner size="xl"/>
          </div>
          <p className="mt-6">Authenticating with <span className="font-bold">{connectorName}</span>...</p>
        </div> 
        <Button onClick={handleOpenPicker}>Open Picker</Button>
    </div>
  )
}

const renderModalFooter = () => {

  if (isLoading) {
    return <></>
  }

  if (authFlowStep === 2 && isSuccess) {
    return (
      <div className="flex flex-col items-center"> 
      <Button size="xl" className="w-3/5 min-w-300" onClick={() => window.close()}>
          Finish
        </Button>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center"> 
      <Button color="gray" size="xl" className="w-3/5 min-w-300" onClick={() => {
        if (authFlowStep === 0) {
          setCurrentStep(currentStep - 1)
        } else {
          setAuthFlowStep(authFlowStep - 1)
        }
      }}>
        Go Back
      </Button>
      </div>
    )
  }
}

return (
  <div className="px-8">
    {renderModalBody()}
    {/* {renderResult()} */}
    {renderModalFooter()}
  </div>
);
}

export default GDriveAuthFlow;


