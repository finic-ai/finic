import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useContext,
} from "react";
import "./App.css";

import StartPage from "./components/StartPage";
import ConnectorPage from "./components/ConnectorPage";
import { useModalContext } from "./context/ModalContext";
import NotionAuthFlow from "./components/auth/NotionAuthFlow";
import GDriveAuthFlow from "./components/auth/GDriveAuthFlow";
import ZendeskAuthFlow from "./components/auth/ZendeskAuthFlow";
import ConfluenceAuthFlow from "./components/auth/ConfluenceAuthFlow";
import SlackAuthFlow from "./components/auth/SlackAuthFlow";
import DropboxAuthFlow from "./components/auth/DropboxAuthFlow";
import IntercomAuthFlow from "./components/auth/IntercomAuthFlow";
import HubspotAuthFlow from "./components/auth/HubspotAuthFlow";
import ReadmeAuthFlow from "./components/auth/ReadmeAuthFlow";
import SalesforceAuthFlow from "./components/auth/SalesforceAuthFlow";
import ModalHeader from "./components/ModalHeader";
import WebAuthFlow from "./components/auth/WebAuthForm";
import GmailAuthFlow from "./components/auth/GmailAuthFlow";
import SharepointAuthFlow from "./components/auth/SharepointAuthFlow";
import GithubAuthFlow from "./components/auth/GithubAuthFlow";

const PSYCHIC_URL = process.env.REACT_APP_PSYCHIC_URL;

type Metadata = {
  [key: string]: string | null;
};

const App: React.FC = () => {
  const {
    currentStep,
    selectedConnectorId,
    setSelectedConnectorId,
    accountId,
    publicKey,
    customerLogoUrl,
    setCurrentStep,
  } = useModalContext();

  const renderAppStep = () => {
    switch (currentStep) {
      case 0:
        return <StartPage />;
      case 1:
        return <ConnectorPage />;
      case 2:
        if (selectedConnectorId == "confluence") {
          return <ConfluenceAuthFlow />;
        } else if (selectedConnectorId == "dropbox") {
          return <DropboxAuthFlow />;
        } else if (selectedConnectorId == "gdrive") {
          return <GDriveAuthFlow />;
        } else if (selectedConnectorId == "gmail") {
          return <GmailAuthFlow />;
        } else if (selectedConnectorId == "github") {
          return <GithubAuthFlow />;
        } else if (selectedConnectorId == "hubspot") {
          return <HubspotAuthFlow />;
        } else if (selectedConnectorId == "intercom") {
          return <IntercomAuthFlow />;
        } else if (selectedConnectorId == "notion") {
          return <NotionAuthFlow />;
        } else if (selectedConnectorId == "readme") {
          return <ReadmeAuthFlow />;
        } else if (selectedConnectorId == "salesforce") {
          return <SalesforceAuthFlow />;
        } else if (selectedConnectorId == "slack") {
          return <SlackAuthFlow />;
        } else if (selectedConnectorId == "web") {
          return <WebAuthFlow />;
        } else if (selectedConnectorId == "zendesk") {
          return <ZendeskAuthFlow />;
        } else if (selectedConnectorId == "sharepoint") {
          return <SharepointAuthFlow />;
        } else {
          return <div>Unknown connector</div>;
        }
      default:
        return <StartPage />;
    }
  };

  return (
    <div className="App">
      <div>
        <ModalHeader />
        {renderAppStep()}
      </div>
    </div>
  );
};

export default App;
