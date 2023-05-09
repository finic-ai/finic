import React, { useRef, useEffect, useCallback, useState } from 'react';
import './App.css';

import StartPage from './components/StartPage'
import ConnectorPage from './components/ConnectorPage'
import ResultPage from './components/ResultPage'

const PSYCHIC_URL = process.env.REACT_APP_PSYCHIC_URL

type Metadata = {
  [key: string]: string | null;
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [customerName, setCustomerName] = React.useState('Support Hero')
  const [customerLogoUrl, setCustomerLogoUrl] = React.useState('https://uploads-ssl.webflow.com/6401c72af7f8fc5af247a5c7/644d9f332d59bb5fbb0b60e3_Icon%20(3).png')
  const [connectorName, setConnectorName] = React.useState('')
  const [selectedConnectorId, setSelectedConnectorId] = React.useState('')
  const [newConnection, setNewConnection] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [authCode, setAuthCode] = useState('')

  const authCodeHandled = useRef(false)

  // Capture the connection_id and from the URL params
  const urlParams = new URLSearchParams(window.location.search)
  const connectionId = urlParams.get('connection_id')
  const publicKey = urlParams.get('public_key')

  const startConnectorAuthFlow = async (connectorId: string) => {
    setIsLoading(true)
    console.log("hello")
    console.log(connectionId)
    console.log(publicKey)
    if (!connectionId || !publicKey) {
      setError('Invalid connection_id or public_key')
      setIsLoading(false)
      return
    }
    
    const result = await authorizeConnection(connectorId, connectionId, publicKey)
    const auth_url = result.auth_url
    console.log(result)
    // Open the auth url in a new window and center it.
    const width = window.innerWidth;
    const height = window.innerHeight;
    const left = window.screenX
    const top = window.screenY
    window.open(auth_url, '_blank', `addressbar=no, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`)
  }

  // Listen for messages from OAuth windows opened by this component
  const handleMessage = useCallback((event: MessageEvent) => {
    // check if oigin is not http://localhost:5173 or link.psychic.dev
    if (event.origin !== "http://localhost:3000" && event.origin !== "https://link.psychic.dev") {
      return;
    }
    const data = event.data;
    if (data && data.code && !authCodeHandled.current) {
      authCodeHandled.current = true
      setAuthCode(data.code)
      
    }
  }, [selectedConnectorId])

  // If Oauth is successful, send the auth code to the backend
  async function completeAuthWithCode(connectorId: string, authCode: string, metadata?: any) {
    if (!connectionId || !publicKey) {
      setError('Invalid connection_id or public_key')
      setIsLoading(false)
      return
    }
    const result = await authorizeConnection(
        connectorId, 
        connectionId, 
        publicKey,
        authCode,
        metadata
    )
    if (!result) {
      setError('Something went wrong. Please try again.')
      setIsSuccess(false)
      setIsLoading(false)
      return
    }
    setNewConnection(result.connection.connection_id)
    setIsSuccess(true)
    setIsLoading(false)
    // Notify opening window that auth is complete
    if (window.opener) {
      window.opener.postMessage({ connection_id: result.connection.connection_id }, '*')
    }
  }

  useEffect(() => {
    // Add event listeners to get auth codes
    window.addEventListener('message', handleMessage, false);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [selectedConnectorId]);

  useEffect(() => {
    if (authCode) {
      if (selectedConnectorId == 'notion') {
        completeAuthWithCode(selectedConnectorId, authCode)
      } else {
        setIsLoading(false)
      }
    }
  }, [authCode])

  useEffect(() => {
    if (metadata) {
      completeAuthWithCode(selectedConnectorId, authCode, metadata)
    }
  }, [metadata])

  const renderAppStep = () => {
    switch (currentStep) {
      case 0:
        return <StartPage 
                  customerName={customerName} 
                  customerLogoUrl={customerLogoUrl} 
                  setCurrentStep={setCurrentStep}/>
      case 1:
        return <ConnectorPage 
                  customerName={customerName} 
                  customerLogoUrl={customerLogoUrl} 
                  currentStep={currentStep} 
                  setCurrentStep={setCurrentStep} 
                  setConnectorName={setConnectorName}
                  setSelectedConnectorId={setSelectedConnectorId}
                  startConnectorAuthFlow={startConnectorAuthFlow}
                  />
      case 2:
        return <ResultPage 
                  selectedConnectorId={selectedConnectorId}
                  metadata={metadata}
                  setMetadata={setMetadata}
                  customerName={customerName} 
                  customerLogoUrl={customerLogoUrl} 
                  currentStep={currentStep} 
                  setCurrentStep={setCurrentStep} 
                  connectorName={connectorName} 
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  error={error}
                  isSuccess={isSuccess}
                  />
      default:
        return <StartPage 
                  customerName={customerName} 
                  customerLogoUrl={customerLogoUrl} 
                  setCurrentStep={setCurrentStep}/>
    }
  }

  type AuthPayload = {
    connector_id: string;
    connection_id: string;
    auth_code?: string;
    metadata?: string;
  }

  async function authorizeConnection(
      connectorId: string, 
      connectionId: string,
      publicKey: string,
      authCode?: string,
      metadata?: any
      ) {

    const url = PSYCHIC_URL + '/add-oauth-connection';

    var payload: AuthPayload = {
      connection_id: connectionId,
      connector_id: connectorId
    }
    if (authCode) {
      payload.auth_code = authCode
    }
    if (metadata) {
      payload.metadata = metadata
    }

    console.log(payload)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicKey}`},
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setError('Something went wrong. Please try again.')
        setIsSuccess(false)
        setIsLoading(false)
        throw new Error(`Authorization failed with status: ${response.status}`);
      }

      const data = await response.json();

      return data.result;
    } catch (error) {
      setError('Something went wrong. Please try again.')
      setIsSuccess(false)
      setIsLoading(false)
      throw new Error(`Authorization failed with error: ${error}`);
    }
  }

  return (
    <div className="App">
     <div>
        {renderAppStep()}
      </div>
    </div>
  );
}

export default App;
