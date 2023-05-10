import React, { useState, useRef, createContext, ReactNode, useContext } from 'react';

const PSYCHIC_URL = process.env.REACT_APP_PSYCHIC_URL


interface ModalContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerLogoUrl: string;
  setCustomerLogoUrl: (url: string) => void;
  connectorName: string;
  setConnectorName: (name: string) => void;
  selectedConnectorId: string;
  setSelectedConnectorId: (id: string) => void;
  newConnection: any;
  setNewConnection: (connection: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
  isSuccess: boolean;
  setIsSuccess: (success: boolean) => void;
  metadata: any;
  setMetadata: (metadata: any) => void;
  authCode: string;
  setAuthCode: (code: string) => void;
  authCodeHandled: React.MutableRefObject<boolean>;
  connectionId: string | null;
  publicKey: string | null;
  authorizeConnection: Function;
  startConnectorAuthFlow: Function;
}

type AuthPayload = {
  connector_id: string;
  connection_id: string;
  auth_code?: string;
  metadata?: string;
}

// Create a context
const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProviderProps {
  children: ReactNode;
}

// Custom provider component
const ModalProvider = ({ children }: ModalProviderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [customerName, setCustomerName] = useState('Support Hero');
  const [customerLogoUrl, setCustomerLogoUrl] = useState('https://uploads-ssl.webflow.com/6401c72af7f8fc5af247a5c7/644d9f332d59bb5fbb0b60e3_Icon%20(3).png');
  const [connectorName, setConnectorName] = useState('');
  const [selectedConnectorId, setSelectedConnectorId] = useState('');
  const [newConnection, setNewConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [authCode, setAuthCode] = useState('');

  const authCodeHandled = useRef(false);

  const urlParams = new URLSearchParams(window.location.search);
  const connectionId = urlParams.get('connection_id');
  const publicKey = urlParams.get('public_key');

  const value: ModalContextType = {
    currentStep,
    setCurrentStep,
    customerName,
    setCustomerName,
    customerLogoUrl,
    setCustomerLogoUrl,
    connectorName,
    setConnectorName,
    selectedConnectorId,
    setSelectedConnectorId,
    newConnection,
    setNewConnection,
    isLoading,
    setIsLoading,
    error,
    setError,
    isSuccess,
    setIsSuccess,
    metadata,
    setMetadata,
    authCode,
    setAuthCode,
    authCodeHandled,
    connectionId,
    publicKey,
    authorizeConnection,
    startConnectorAuthFlow
  };

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

  async function startConnectorAuthFlow(window: any, connectorId: string) {
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

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

const useModalContext = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
      throw new Error('useModalContext must be used within an ModalProvider');
    }
    return context;
  };

export { ModalContext, ModalProvider, useModalContext };
