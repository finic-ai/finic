var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Avatar, } from "flowbite-react";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import React from "react";
var ModalHeader = function (_a) {
    var customerLogoUrl = _a.customerLogoUrl, currentStep = _a.currentStep, setCurrentStep = _a.setCurrentStep;
    return (React.createElement("div", { className: "flex w-full justify-between" },
        React.createElement("button", { onClick: function () { return setCurrentStep(currentStep - 1); }, className: "items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900" },
            React.createElement(HiOutlineArrowLeft, { className: "h-5 w-5 text-gray-400" })),
        React.createElement(Avatar.Group, null,
            React.createElement(Avatar, { img: customerLogoUrl, rounded: true, stacked: true, size: "sm" }),
            React.createElement(Avatar, { img: "https://uploads-ssl.webflow.com/6401c72af7f8fc5af247a5c7/644d9fa48bde357e0426aee7_dark_icon.png", rounded: true, stacked: true, size: "sm" })),
        React.createElement("div", { className: "w-px:32" })));
};
// Workaround needed because Flowbite doesn't support forwarding props
export var withModalHeaderProps = function (Component, additionalProps) {
    return function (props) { return React.createElement(Component, __assign({}, additionalProps, props)); };
};
export default ModalHeader;
