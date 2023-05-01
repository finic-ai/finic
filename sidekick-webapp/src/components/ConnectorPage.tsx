/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Avatar,
  Button,
  Badge,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import React from "react";
import { useState } from "react";

import ModalHeader, { withModalHeaderProps } from "./ModalHeader";

import NotionIcon from "./icons/NotionIcon";
import GoogleDriveIcon from "./icons/GoogleDriveIcon";
import ConfluenceIcon from "./icons/ConfluenceIcon";
import ZendeskIcon from "./icons/ZendeskIcon";
import GithubIcon from "./icons/GithubIcon";

// This should be set via a config file eventually so new connectors can be added declaratively without modifying this file
const connectors = [
  {
    name: "Notion",
    icon: NotionIcon,
    label: "Popular",
    labelColor: "info",
    active: true,
  },
  {
    name: "Google Drive",
    icon: GoogleDriveIcon,
    label: null,
    labelColor: "info",
    active: true
  },
  {
    name: "Confluence",
    icon: ConfluenceIcon,
    label: "In Development",
    labelColor: "warning",
    active: false
  },
  {
    name: "Zendesk",
    icon: ZendeskIcon,
    label: "In Development",
    labelColor: "warning",
    active: false
  },
  {
    name: "Github",
    icon: GithubIcon,
    label: "In Development",
    labelColor: "warning",
    active: false
  },
]

interface ConnectorPageProps {
  customerName: string,
  currentStep: number,
  setCurrentStep: Function,
  customerLogoUrl: string,
  setConnectorName: Function
}
  
const ConnectorPage: React.FC<ConnectorPageProps> = ({customerName, customerLogoUrl, currentStep, setCurrentStep, setConnectorName}) => {
  const pickConnector = (connectorName: string) => {
    setCurrentStep(2)
    setConnectorName(connectorName)
  }

  const renderConnectorButton = (ConnectorIcon: React.FC, connectorName: string, label: string|null, labelColor: string, active: boolean) => {
    return (
      <button
        className={active ? "group flex items-center text-left w-full rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow" : "group flex items-center text-left w-full rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 pointer-events-none opacity-50"}
        onClick={() => pickConnector(connectorName)}
      >
        <ConnectorIcon/>
        <span className="ml-3 flex-1 whitespace-nowrap">
          {connectorName}
        </span>
        {label && <Badge color={labelColor}>{label}</Badge>}
      </button>
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
        <div className="space-y-6">
          <p className="font-normal">Choose the knowledge base you want to share with <span className="font-bold">{customerName}</span>.</p>
          <ul className="my-4 space-y-3">
            {connectors.map((connector) => {
              return (<li>
                {renderConnectorButton(connector.icon, connector.name, connector.label, connector.labelColor, connector.active)}
              </li>)
            })}
          </ul>
          <div className="text-xs font-normal text-gray-500">
            {"When you connect an application, your data in the application will be shared with Support Hero. The specific resources shared will depend on your permissions in the application, as well as the scopes configured by Support Hero. "}
            <a
              href="#"
              className="underline text-blue-500 hover:text-blue-600"
            >
            Click here to learn more.
            </a>
          </div>
        </div>
      </Modal.Body>
    )
  }

  const renderModalFooter = () => {
    return (
      <Modal.Footer className="flex flex-col space-y-6">
        <Button color="gray" size="xl" className="w-3/5 min-w-300" onClick={() => setCurrentStep(0)}>
          Go Back
        </Button>
      </Modal.Footer>
    )
  }

  return (
    <div>
      {renderModalHeader()}
      {renderModalBody()}
    </div>
  );
}

export default ConnectorPage;
  