/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Avatar,
  Button,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import React from "react";
import { useState } from "react";

import ModalHeader, { withModalHeaderProps } from "./ModalHeader";

import NotionIcon from "./connector_icons/NotionIcon";
import GoogleDriveIcon from "./connector_icons/GoogleDriveIcon";
import ConfluenceIcon from "./connector_icons/ConfluenceIcon";
import ZendeskIcon from "./connector_icons/ZendeskIcon";
import GithubIcon from "./connector_icons/GithubIcon";

// This should be set via a config file eventually so new connectors can be added declaratively without modifying this file
const connectors = [
  {
    name: "Notion",
    icon: NotionIcon,
    label: "Popular",
    labelBackgroundColor: "bg-gray-200",
    active: true,
  },
  {
    name: "Google Drive",
    icon: GoogleDriveIcon,
    label: null,
    labelBackgroundColor: "bg-gray-200",
    active: true
  },
  {
    name: "Confluence",
    icon: ConfluenceIcon,
    label: "In Development",
    labelBackgroundColor: "bg-yellow-100",
    active: false
  },
  {
    name: "Zendesk",
    icon: ZendeskIcon,
    label: "In Development",
    labelBackgroundColor: "bg-yellow-100",
    active: false
  },
  {
    name: "Github",
    icon: GithubIcon,
    label: "In Development",
    labelBackgroundColor: "bg-yellow-100",
    active: false
  },
]

interface StartPageProps {
  customerName: string,
  setCurrentStep: Function,
  customerLogoUrl: string,
  setConnectorName: Function
}
  
const ConnectorPage: React.FC<StartPageProps> = ({customerName, customerLogoUrl, setCurrentStep, setConnectorName}) => {
  const pickConnector = (connectorName: string) => {
    setCurrentStep(2)
    setConnectorName(connectorName)
  }

  const renderConnectorButton = (ConnectorIcon: React.FC, connectorName: string, label: string|null, labelBackgroundColor: string|null, active: boolean) => {
    return (
      <button
        className={active ? "group flex items-center text-left w-full rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow" : "group flex items-center text-left w-full rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 pointer-events-none opacity-50"}
        onClick={() => pickConnector(connectorName)}
      >
        <ConnectorIcon/>
        <span className="ml-3 flex-1 whitespace-nowrap">
          {connectorName}
        </span>
        {label && (<span className={"ml-3 inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400" + " " + labelBackgroundColor}>
          {label}
        </span>)}
      </button>
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
        <div className="space-y-6">
          <p className="font-normal">Choose the application you want to connect to <span className="font-bold">{customerName}</span>.</p>
          <ul className="my-4 space-y-3">
            {connectors.map((connector) => {
              return (<li>
                {renderConnectorButton(connector.icon, connector.name, connector.label, connector.labelBackgroundColor, connector.active)}
              </li>)
            })}
          </ul>
          <div className="text-xs font-normal text-gray-500">
            {"When you connect an account, your data in application will be shared with Support Hero. The specific resources shared will depend on your permissions in the application, as well as the scopes configured by Support Hero. "}
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
  