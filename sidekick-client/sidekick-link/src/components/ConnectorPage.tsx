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

import {
  HiOutlineArrowLeft
} from "react-icons/hi2";

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
  setConnectorName: Function,
  startConnectorAuthFlow: Function
}
  
const ConnectorPage: React.FC<ConnectorPageProps> = ({customerName, customerLogoUrl, currentStep, setCurrentStep, setConnectorName, startConnectorAuthFlow}) => {
  const pickConnector = (connectorName: string) => {
    setCurrentStep(2)
    setConnectorName(connectorName)
    startConnectorAuthFlow(connectorName)
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
      <div>
        <ModalHeader customerLogoUrl={customerLogoUrl} currentStep={currentStep} setCurrentStep={setCurrentStep}/>
        <p className="font-normal">Choose the knowledge base you want to share with <span className="font-bold">{customerName}</span>.</p>
      </div>
    )
  }

  const renderModalBody = () => {
    return (
      <div className="space-y-6 px-8 text-left">
        <div className="space-y-6">
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
      </div>
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
  