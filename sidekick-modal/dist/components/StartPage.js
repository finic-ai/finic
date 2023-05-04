/* eslint-disable jsx-a11y/anchor-is-valid */
import { Avatar, Button, Modal, } from "flowbite-react";
import { HiLockClosed, HiEyeSlash } from "react-icons/hi2";
import React from "react";
var StartPage = function (_a) {
    var customerName = _a.customerName, customerLogoUrl = _a.customerLogoUrl, setCurrentStep = _a.setCurrentStep;
    var renderModalHeader = function () {
        return (React.createElement(Modal.Header, null,
            React.createElement("div", { className: "flex flex-col items-center" },
                React.createElement(Avatar.Group, { className: "my-4" },
                    React.createElement(Avatar, { img: customerLogoUrl, rounded: true, stacked: true, size: "lg" }),
                    React.createElement(Avatar, { img: "https://uploads-ssl.webflow.com/6401c72af7f8fc5af247a5c7/644d9fa48bde357e0426aee7_dark_icon.png", rounded: true, stacked: true, size: "lg" })),
                React.createElement("p", { className: "font-normal text-center" },
                    React.createElement("span", { className: "font-bold" }, customerName),
                    " uses ",
                    React.createElement("span", { className: "font-bold" }, "Sidekick"),
                    " to connect to your knowledge base applications."))));
    };
    var renderModalBody = function () {
        return (React.createElement(Modal.Body, { className: "space-y-6 px-8" },
            React.createElement("div", { className: "space-y-1" },
                React.createElement(HiLockClosed, { className: "text-3xl mr-1 text-gray-600" }),
                React.createElement("h5", { className: "text-xl font-bold tracking-tight text-gray-900 mt-2" }, "Your data is secure"),
                React.createElement("p", { className: "text-base leading-relaxed text-gray-500" }, "Sidekick is SOC2 compliant and doesn\u2019t sell your data, or share it with any third parties except those you explicitly authorize.")),
            React.createElement("div", { className: "space-y-1" },
                React.createElement(HiEyeSlash, { className: "text-3xl mr-1 text-gray-600" }),
                React.createElement("h5", { className: "text-xl font-bold tracking-tight text-gray-900 mt-2" }, "Your organization\u2019s controls are respected"),
                React.createElement("p", { className: "text-base leading-relaxed text-gray-500" }, "Sidekick ensures that access control lists (ACLs) set by your organization are preserved. Only those resources you have permission to view will be shared with Support Hero."))));
    };
    var renderModalFooter = function () {
        return (React.createElement(Modal.Footer, { className: "flex flex-col space-y-6" },
            React.createElement("p", { className: "text-sm text-gray-500" },
                "By selecting \u201CContinue\u201D you agree to the ",
                React.createElement("a", { href: "https://www.getsidekick.ai/privacy-policy", target: "_blank", className: "underline text-blue-500" }, "Sidekick End User Privacy Policy")),
            React.createElement(Button, { size: "xl", className: "w-3/5 min-w-300", onClick: function () { return setCurrentStep(1); } }, "Continue")));
    };
    return (React.createElement("div", null,
        renderModalHeader(),
        renderModalBody(),
        renderModalFooter()));
};
export default StartPage;
