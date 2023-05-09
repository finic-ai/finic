import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import './App.css';

import StartPage from './components/StartPage'
import ConnectorPage from './components/ConnectorPage'
import ResultPage from './components/ResultPage'
import { useModalContext } from './context/ModalContext'
import NotionAuthFlow from './components/auth/NotionAuthFlow';
import GDriveAuthFlow from './components/auth/GDriveAuthFlow';

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
        {renderAppStep()}
      </div>
    </div>
  );
}

export default App;
