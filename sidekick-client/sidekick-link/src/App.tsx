import React from 'react';
import './App.css';

import authorizeConnector from './hooks/authorizeConnector';
// import useSidekickLink from './hooks/useSidekickLink';

import StartPage from './components/StartPage'
import ConnectorPage from './components/ConnectorPage'
import ResultPage from './components/ResultPage'

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [customerName, setCustomerName] = React.useState('Support Hero')
  const [customerLogoUrl, setCustomerLogoUrl] = React.useState('https://uploads-ssl.webflow.com/6401c72af7f8fc5af247a5c7/644d9f332d59bb5fbb0b60e3_Icon%20(3).png')
  const [connectorName, setConnectorName] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const startConnectorAuthFlow = async (connectorName: string) => {
    // 1. Open the OAuth flow for the connector
    // 2. Wait for the OAuth flow to complete
    // 3. Once redirected back to dashboard.getsidekick.ai/oauth/redirect, capture the auth code and send it to the backend
    // 4. Show a success message and close the window  
    
    const result = await authorizeConnector(connectorName, 'test_token', 'connection_id_placeholder')
    const auth_url = result.data.auth_url
    // Open the auth url in a new window and center it.
    const width = 600
    const height = 800
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2
    window.open(auth_url, '_blank', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`)
  }

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
                  startConnectorAuthFlow={startConnectorAuthFlow}
                  />
      case 2:
        return <ResultPage 
                  customerName={customerName} 
                  customerLogoUrl={customerLogoUrl} 
                  currentStep={currentStep} 
                  setCurrentStep={setCurrentStep} 
                  connectorName={connectorName} 
                  isLoading={isLoading}
                  />
      default:
        return <StartPage 
                  customerName={customerName} 
                  customerLogoUrl={customerLogoUrl} 
                  setCurrentStep={setCurrentStep}/>
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
