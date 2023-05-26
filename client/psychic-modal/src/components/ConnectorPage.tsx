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
import { useState, useEffect } from "react";
import { useModalContext } from "../context/ModalContext";

import {
  HiOutlineArrowLeft
} from "react-icons/hi2";


import NotionIcon from "./icons/NotionIcon";
import GoogleDriveIcon from "./icons/GoogleDriveIcon";
import ConfluenceIcon from "./icons/ConfluenceIcon";
import ZendeskIcon from "./icons/ZendeskIcon";
import GithubIcon from "./icons/GithubIcon";
import SlackIcon from "./icons/SlackIcon";
import { start } from "repl";

// This should be set via a config file eventually so new connectors can be added declaratively without modifying this file
const connectors = [
  {
    name: "Notion",
    id: "notion",
    icon: NotionIcon,
    label: "Popular",
    labelColor: "info",
    active: true,
  },
  {
    name: "Google Drive",
    id: "gdrive",
    icon: GoogleDriveIcon,
    label: null,
    labelColor: "info",
    active: true
  },
  {
    name: "Confluence",
    id: "confluence",
    icon: ConfluenceIcon,
    label: null,
    labelColor: "info",
    active: true
  },
  {
    name: "Zendesk",
    id: "zendesk",
    icon: ZendeskIcon,
    label: null,
    labelColor: "info",
    active: true
  },
  {
    name: "Slack",
    id: "slack",
    icon: SlackIcon,
    label: null,
    labelColor: "info",
    active: true
  },
  {
    name: "Github",
    id: "github",
    icon: GithubIcon,
    label: "In Development",
    labelColor: "warning",
    active: false
  },
]
  
const ConnectorPage: React.FC = () => {

  const { customerName, customerLogoUrl, currentStep, setCurrentStep, setConnectorName, setSelectedConnectorId, startConnectorAuthFlow, setMetadata } = useModalContext()

  const pickConnector = (connectorName: string, connectorId: string) => {
    setCurrentStep(2)
    setConnectorName(connectorName)
    setSelectedConnectorId(connectorId)
    if (connectorId == 'notion' || connectorId == 'confluence' || connectorId == 'slack') {
      console.log('hello')
      startConnectorAuthFlow(window, connectorId)
    }
  }

  const renderConnectorButton = (ConnectorIcon: React.FC, connectorName: string, connectorId: string, label: string|null, labelColor: string, active: boolean) => {
    return (
      <button
        className={active ? "group flex items-center text-left w-full rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow" : "group flex items-center text-left w-full rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 pointer-events-none opacity-50"}
        onClick={() =>  {
          pickConnector(connectorName, connectorId)
        }}
      >
        <ConnectorIcon/>
        <span className="ml-3 flex-1 whitespace-nowrap">
          {connectorName}
        </span>
        {label && <Badge color={labelColor}>{label}</Badge>}
      </button>
    )
  }


  const renderModalBody = () => {
    return (
      <div className="space-y-6 px-8 text-left">
        <div className="space-y-6">
          <ul className="my-4 space-y-3">
            {connectors.map((connector) => {
              
              return (<li>
                {renderConnectorButton(connector.icon, connector.name, connector.id, connector.label, connector.labelColor, connector.active)}
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

  useEffect(() => {
    setMetadata(null)
  }, [])

  return (
    <div>
      {renderModalBody()}
    </div>
  );
}

export default ConnectorPage;
  