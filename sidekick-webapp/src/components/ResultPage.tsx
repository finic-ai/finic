/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  Spinner,
  Modal,
} from "flowbite-react";
import React from "react";
import { useState } from "react";

import ModalHeader, { withModalHeaderProps } from "./ModalHeader";

import NotionIcon from "./connector_icons/NotionIcon";
import GoogleDriveIcon from "./connector_icons/GoogleDriveIcon";
import ConfluenceIcon from "./connector_icons/ConfluenceIcon";
import ZendeskIcon from "./connector_icons/ZendeskIcon";
import GithubIcon from "./connector_icons/GithubIcon";

interface StartPageProps {
  customerName: string,
  setCurrentStep: Function,
  customerLogoUrl: string,
  connectorName: string
}
  
const ConnectorPage: React.FC<StartPageProps> = ({customerName, customerLogoUrl, connectorName, setCurrentStep}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const renderResult = () => {
    if (isError) {
      return (
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-gray-600">We couldn't connect to {customerName}. Please try again.</p>
        </div>
      )
    }

    if (isSuccess) {
      return (
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Success!</h2>
          <p className="text-gray-600">You have successfully connected to {customerName}.</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Connecting to {customerName}</h2>
        <p className="text-gray-600">Please wait while we connect to {customerName}.</p>
      </div>
    )
  }

  const renderModalHeader = () => {
    return (
      <Modal.Header as={withModalHeaderProps(ModalHeader, { customerLogoUrl })} />
    )

  }

  const renderModalBody = () => {
    return (
      <Modal.Body className="space-y-6 px-8">
        <div className="text-center">
          <p>Connecting to <span className="font-bold">{connectorName}</span></p>
          {isLoading ? <Spinner size="xl"/> : renderResult()}
        </div>
      </Modal.Body>
    )
  }

  const renderModalFooter = () => {
    return (
      <Modal.Footer className="flex flex-col space-y-6">
        <Button size="xl" className="w-3/5 min-w-300" onClick={() => setCurrentStep(1)}>
          Continue
        </Button>
      </Modal.Footer>
    )
  }

  return (
    <div>
      {renderModalHeader()}
      {renderModalBody()}
      {renderModalFooter()}
    </div>
  );
}

export default ConnectorPage;
  