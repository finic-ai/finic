import React from 'react';
import {
  Button,
  Modal,
} from "flowbite-react";
import './App.css';

import StartPage from './components/StartPage'
import ConnectorPage from './components/ConnectorPage'
import ResultPage from './components/ResultPage'

const App: React.FC = () => {
  const [showModal, setShowModal] = React.useState(true)
  const [currentStep, setCurrentStep] = React.useState(1)
  const [customerName, setCustomerName] = React.useState('Support Hero')
  const [customerLogoUrl, setCustomerLogoUrl] = React.useState('https://uploads-ssl.webflow.com/6401c72af7f8fc5af247a5c7/644d9f332d59bb5fbb0b60e3_Icon%20(3).png')

  const renderAppStep = () => {
    switch (currentStep) {
      case 0:
        return <StartPage customerName={customerName} customerLogoUrl={customerLogoUrl} setCurrentStep={setCurrentStep}/>
      case 1:
        return <ConnectorPage customerName={customerName} customerLogoUrl={customerLogoUrl} setCurrentStep={setCurrentStep}/>
      case 2:
        return <ResultPage />
      default:
        return <StartPage customerName={customerName} customerLogoUrl={customerLogoUrl} setCurrentStep={setCurrentStep}/>
    }
  }

  return (
    <div className="App">
     <Modal show={showModal} size="xl">
        {renderAppStep()}
      </Modal>
    </div>
  );
}

export default App;
