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

import { TbWorld } from "react-icons/tb";

import NotionIcon from "./icons/NotionIcon";
import GoogleDriveIcon from "./icons/GoogleDriveIcon";
import ConfluenceIcon from "./icons/ConfluenceIcon";
import ZendeskIcon from "./icons/ZendeskIcon";
import GithubIcon from "./icons/GithubIcon";
import SlackIcon from "./icons/SlackIcon";
import DropboxIcon from "./icons/DropboxIcon";
import IntercomIcon from "./icons/IntercomIcon";
import HubspotIcon from "./icons/HubspotIcon";
import ReadmeIcon from "./icons/ReadmeIcon";
import SalesforceIcon from "./icons/SalesforceIcon";
import SharepointIcon from "./icons/SharepointIcon";
import { start } from "repl";
import GmailIcon from "./icons/GmailIcon";

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
    active: true,
  },
  {
    name: "Confluence",
    id: "confluence",
    icon: ConfluenceIcon,
    label: null,
    labelColor: "info",
    active: true,
  },
  {
    name: "Zendesk",
    id: "zendesk",
    icon: ZendeskIcon,
    label: null,
    labelColor: "info",
    active: true,
  },
  {
    name: "Slack",
    id: "slack",
    icon: SlackIcon,
    label: null,
    labelColor: "info",
    active: true,
  },
  {
    name: "Dropbox",
    id: "dropbox",
    icon: DropboxIcon,
    label: null,
    labelColor: "info",
    active: true,
  },
  {
    name: "Readme",
    id: "readme",
    icon: ReadmeIcon,
    label: null,
    labelColor: "info",
    active: true,
  },
  {
    name: "Sharepoint",
    id: "sharepoint",
    icon: SharepointIcon,
    label: null,
    labelColor: "info",
    active: true,
  },
  {
    name: "Website",
    id: "web",
    icon: TbWorld,
    label: null,
    labelColor: "info",
    active: true,
  },
  {
    name: "Gmail",
    id: "gmail",
    icon: GmailIcon,
    label: "Alpha",
    labelColor: "warning",
    active: true,
  },
  {
    name: "Intercom",
    id: "intercom",
    icon: IntercomIcon,
    label: "Alpha",
    labelColor: "warning",
    active: true,
  },
  {
    name: "Hubspot",
    id: "hubspot",
    icon: HubspotIcon,
    label: "Alpha",
    labelColor: "warning",
    active: true,
  },
  {
    name: "Salesforce",
    id: "salesforce",
    icon: SalesforceIcon,
    label: "Alpha",
    labelColor: "warning",
    active: true,
  },
  {
    name: "Github",
    id: "github",
    icon: GithubIcon,
    label: "Alpha",
    labelColor: "warning",
    active: true,
  },
];

const ConnectorPage: React.FC = () => {
  const {
    enabledConnectors,
    whitelabel,
    customerName,
    setCurrentStep,
    setConnectorName,
    setSelectedConnectorId,
    startConnectorAuthFlow,
    setMetadata,
    connectorsThatStartOAuthFirst,
  } = useModalContext();

  const pickConnector = (connectorName: string, connectorId: string) => {
    setCurrentStep(2);
    setConnectorName(connectorName);
    setSelectedConnectorId(connectorId);
    if (connectorsThatStartOAuthFirst.includes(connectorId)) {
      startConnectorAuthFlow(window, connectorId);
    }
  };

  const renderConnectorButton = (
    ConnectorIcon: React.FC,
    connectorName: string,
    connectorId: string,
    label: string | null,
    labelColor: string,
    active: boolean
  ) => {
    return (
      <button
        className={
          active
            ? "group flex items-center text-left w-full rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow"
            : "group flex items-center text-left w-full rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 pointer-events-none opacity-50"
        }
        onClick={() => {
          pickConnector(connectorName, connectorId);
        }}
      >
        <ConnectorIcon />
        <span className="ml-3 flex-1 whitespace-nowrap">{connectorName}</span>
        {label && <Badge color={labelColor}>{label}</Badge>}
      </button>
    );
  };

  const renderModalBody = () => {
    return (
      <div className="space-y-6 px-8 text-left">
        <div className="space-y-6">
          <ul className="my-4 space-y-3">
            {connectors.map((connector) => {
              if (
                enabledConnectors &&
                enabledConnectors.length > 0 &&
                !enabledConnectors.includes(connector.id)
              ) {
                return null;
              }

              return (
                <li>
                  {renderConnectorButton(
                    connector.icon,
                    connector.name,
                    connector.id,
                    connector.label,
                    connector.labelColor,
                    connector.active
                  )}
                </li>
              );
            })}
          </ul>
          <div className="text-xs font-normal text-gray-500">
            {`When you connect an application, your data in the application will be shared with ${customerName}. The specific resources shared will depend on your permissions in the application, as well as the scopes configured by ${customerName}. `}
            {/* <a
              href="#"
              className="underline text-blue-500 hover:text-blue-600"
            >
            Click here to learn more.
            </a> */}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setMetadata(null);
  }, []);

  return <div>{renderModalBody()}</div>;
};

export default ConnectorPage;
