/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  Spinner,
  Modal,
} from "flowbite-react";
import React from "react";
import { useState } from "react";

import ModalHeader, { withModalHeaderProps } from "./ModalHeader";

import SuccessIcon from "./icons/SuccessIcon";
import ErrorIcon from "./icons/ErrorIcon";

interface ResultPageProps {
  customerName: string,
  currentStep: number,
  setCurrentStep: Function,
  customerLogoUrl: string,
  connectorName: string,
  setShowModal: Function,
  isLoading: boolean,
}
  
const ConnectorPage: React.FC<ResultPageProps> = ({customerName, customerLogoUrl, connectorName, currentStep, setCurrentStep, setShowModal, isLoading}) => {
  const [isError, setIsError] = useState(true)
  const [isSuccess, setIsSuccess] = useState(true)

  const renderResult = () => {
    if (isSuccess) {
      return (
        <div className="flex flex-col space-y-4 items-center text-center">
          <SuccessIcon />
          <p className="text-gray-600">You have successfully connected to <span className="font-bold">{connectorName}</span>.</p>
        </div>
      )
    }

  return (
    <div className="flex flex-col space-y-4 items-center text-center">
      <ErrorIcon />
      <div>
        <p className="text-gray-600">We couldn't connect to <span className="font-bold">{connectorName}</span>.</p>
        <p className="mt-1 text-sm text-gray-600">Try it one more time? If it still doesn’t work, contact Sidekick support <a href="mailto:support@getsidekick.ai" className="underline text-blue-500 hover:text-blue-600">here</a> and we’ll fix it.</p>
      </div>
    </div>
  )
  }

  const renderModalHeader = () => {
    return (
      <Modal.Header as={withModalHeaderProps(ModalHeader, { customerLogoUrl, currentStep, setCurrentStep })} />
    )

  }

  const renderModalBody = () => {
    return (
      <Modal.Body className="space-y-6 px-8">
        {isLoading ? <div className="text-center">
          <div className="text-center">
            {isLoading ? <Spinner size="xl"/> : renderResult()}
          </div>
          <p className="mt-6">Authenticating with <span className="font-bold">{connectorName}</span>...</p>
        </div> : 
        renderResult()}
      </Modal.Body>
    )
  }

  const renderModalFooter = () => {
    return (
      <Modal.Footer className="flex flex-col space-y-6">
        {isSuccess && !isLoading &&
          <Button size="xl" className="w-3/5 min-w-300" onClick={() => setShowModal(false)}>
            Finish
          </Button>
        }
        {!isSuccess && !isLoading &&
          <Button color="gray" size="xl" className="w-3/5 min-w-300" onClick={() => setCurrentStep(1)}>
            Go Back
          </Button>
        }
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
  