/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Spinner, Modal, } from "flowbite-react";
import React from "react";
import { useState } from "react";
import ModalHeader, { withModalHeaderProps } from "./ModalHeader";
import SuccessIcon from "./icons/SuccessIcon";
import ErrorIcon from "./icons/ErrorIcon";
var ConnectorPage = function (_a) {
    var customerName = _a.customerName, customerLogoUrl = _a.customerLogoUrl, connectorName = _a.connectorName, currentStep = _a.currentStep, setCurrentStep = _a.setCurrentStep, setShowModal = _a.setShowModal;
    var _b = useState(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = useState(true), isError = _c[0], setIsError = _c[1];
    var _d = useState(true), isSuccess = _d[0], setIsSuccess = _d[1];
    var renderResult = function () {
        if (isSuccess) {
            return (React.createElement("div", { className: "flex flex-col space-y-4 items-center text-center" },
                React.createElement(SuccessIcon, null),
                React.createElement("p", { className: "text-gray-600" },
                    "You have successfully connected to ",
                    React.createElement("span", { className: "font-bold" }, connectorName),
                    ".")));
        }
        return (React.createElement("div", { className: "flex flex-col space-y-4 items-center text-center" },
            React.createElement(ErrorIcon, null),
            React.createElement("div", null,
                React.createElement("p", { className: "text-gray-600" },
                    "We couldn't connect to ",
                    React.createElement("span", { className: "font-bold" }, connectorName),
                    "."),
                React.createElement("p", { className: "mt-1 text-sm text-gray-600" },
                    "Try it one more time? If it still doesn\u2019t work, contact Sidekick support ",
                    React.createElement("a", { href: "mailto:support@getsidekick.ai", className: "underline text-blue-500 hover:text-blue-600" }, "here"),
                    " and we\u2019ll fix it."))));
    };
    var renderModalHeader = function () {
        return (React.createElement(Modal.Header, { as: withModalHeaderProps(ModalHeader, { customerLogoUrl: customerLogoUrl, currentStep: currentStep, setCurrentStep: setCurrentStep }) }));
    };
    var renderModalBody = function () {
        return (React.createElement(Modal.Body, { className: "space-y-6 px-8" }, isLoading ? React.createElement("div", { className: "text-center" },
            React.createElement("div", { className: "text-center" }, isLoading ? React.createElement(Spinner, { size: "xl" }) : renderResult()),
            React.createElement("p", { className: "mt-6" },
                "Authenticating with ",
                React.createElement("span", { className: "font-bold" }, connectorName),
                "...")) :
            renderResult()));
    };
    var renderModalFooter = function () {
        return (React.createElement(Modal.Footer, { className: "flex flex-col space-y-6" },
            isSuccess && !isLoading &&
                React.createElement(Button, { size: "xl", className: "w-3/5 min-w-300", onClick: function () { return setShowModal(false); } }, "Finish"),
            !isSuccess && !isLoading &&
                React.createElement(Button, { color: "gray", size: "xl", className: "w-3/5 min-w-300", onClick: function () { return setCurrentStep(1); } }, "Go Back")));
    };
    return (React.createElement("div", null,
        renderModalHeader(),
        renderModalBody(),
        renderModalFooter()));
};
export default ConnectorPage;
