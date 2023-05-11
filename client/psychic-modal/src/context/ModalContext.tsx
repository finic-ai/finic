import React, { useState, useRef, createContext, ReactNode, useContext } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);
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
  };

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
