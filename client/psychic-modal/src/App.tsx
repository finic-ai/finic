import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import './App.css';

import StartPage from './components/StartPage'
import ConnectorPage from './components/ConnectorPage'
import ResultPage from './components/ResultPage'
import { useModalContext } from './context/ModalContext'
import NotionAuthFlow from './components/auth/NotionAuthFlow';
import GDriveAuthFlow from './components/auth/GDriveAuthFlow';
import ZendeskAuthFlow from './components/auth/ZendeskAuthFlow';
import ModalHeader from './components/ModalHeader';

const PSYCHIC_URL = process.env.REACT_APP_PSYCHIC_URL

type Metadata = {
  [key: string]: string | null;
};

const App: React.FC = () => {

  const {
    currentStep, 
    selectedConnectorId, 
    setSelectedConnectorId,
    connectionId,
    publicKey,
    customerLogoUrl,
    setCurrentStep
  } = useModalContext()

  const renderAppStep = () => {
    switch (currentStep) {
      case 0:
        return <StartPage />
      case 1:
        return <ConnectorPage />
      case 2:
        if (selectedConnectorId == "notion") {
          return <NotionAuthFlow />
        } else if (selectedConnectorId == "gdrive") {
          return <GDriveAuthFlow />
        } else if (selectedConnectorId == "zendesk") {
          return <ZendeskAuthFlow />
        } else if (selectedConnectorId == "confluence") {
          return <div>Confluence</div>
        } else if (selectedConnectorId == "github") {
          return <div>Github</div>
        } else {
          return <div>Unknown connector</div>
        }
      case 3:
        return <ResultPage />
      default:
        return <StartPage />
    }
  }

  return (
    <div className="App">
     <div>
        <ModalHeader />
        {renderAppStep()}
      </div>
    </div>
  );
}

export default App;
