/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Badge, Modal, } from "flowbite-react";
import React from "react";
import ModalHeader, { withModalHeaderProps } from "./ModalHeader";
import NotionIcon from "./icons/NotionIcon";
import GoogleDriveIcon from "./icons/GoogleDriveIcon";
import ConfluenceIcon from "./icons/ConfluenceIcon";
import ZendeskIcon from "./icons/ZendeskIcon";
import GithubIcon from "./icons/GithubIcon";
// This should be set via a config file eventually so new connectors can be added declaratively without modifying this file
var connectors = [
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
];
var ConnectorPage = function (_a) {
    var customerName = _a.customerName, customerLogoUrl = _a.customerLogoUrl, currentStep = _a.currentStep, setCurrentStep = _a.setCurrentStep, setConnectorName = _a.setConnectorName;
    var pickConnector = function (connectorName) {
        setCurrentStep(2);
        setConnectorName(connectorName);
    };
    var renderConnectorButton = function (ConnectorIcon, connectorName, label, labelColor, active) {
        return (React.createElement("button", { className: active ? "group flex items-center text-left w-full rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow" : "group flex items-center text-left w-full rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 pointer-events-none opacity-50", onClick: function () { return pickConnector(connectorName); } },
            React.createElement(ConnectorIcon, null),
            React.createElement("span", { className: "ml-3 flex-1 whitespace-nowrap" }, connectorName),
            label && React.createElement(Badge, { color: labelColor }, label)));
    };
    var renderModalHeader = function () {
        return (React.createElement(Modal.Header, { as: withModalHeaderProps(ModalHeader, { customerLogoUrl: customerLogoUrl, currentStep: currentStep, setCurrentStep: setCurrentStep }) }));
    };
    var renderModalBody = function () {
        return (React.createElement(Modal.Body, { className: "space-y-6 px-8" },
            React.createElement("div", { className: "space-y-6" },
                React.createElement("p", { className: "font-normal" },
                    "Choose the knowledge base you want to share with ",
                    React.createElement("span", { className: "font-bold" }, customerName),
                    "."),
                React.createElement("ul", { className: "my-4 space-y-3" }, connectors.map(function (connector) {
                    return (React.createElement("li", null, renderConnectorButton(connector.icon, connector.name, connector.label, connector.labelColor, connector.active)));
                })),
                React.createElement("div", { className: "text-xs font-normal text-gray-500" },
                    "When you connect an application, your data in the application will be shared with Support Hero. The specific resources shared will depend on your permissions in the application, as well as the scopes configured by Support Hero. ",
                    React.createElement("a", { href: "#", className: "underline text-blue-500 hover:text-blue-600" }, "Click here to learn more.")))));
    };
    var renderModalFooter = function () {
        return (React.createElement(Modal.Footer, { className: "flex flex-col space-y-6" },
            React.createElement(Button, { color: "gray", size: "xl", className: "w-3/5 min-w-300", onClick: function () { return setCurrentStep(0); } }, "Go Back")));
    };
    return (React.createElement("div", null,
        renderModalHeader(),
        renderModalBody()));
};
export default ConnectorPage;
