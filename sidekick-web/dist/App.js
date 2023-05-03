var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React from 'react';
import { Modal, } from "flowbite-react";
import './App.css';
import authorizeConnector from './requests/authorizeConnector';
import StartPage from './components/StartPage';
import ConnectorPage from './components/ConnectorPage';
import ResultPage from './components/ResultPage';
var App = function () {
    var _a = React.useState(true), showModal = _a[0], setShowModal = _a[1];
    var _b = React.useState(0), currentStep = _b[0], setCurrentStep = _b[1];
    var _c = React.useState('Support Hero'), customerName = _c[0], setCustomerName = _c[1];
    var _d = React.useState('https://uploads-ssl.webflow.com/6401c72af7f8fc5af247a5c7/644d9f332d59bb5fbb0b60e3_Icon%20(3).png'), customerLogoUrl = _d[0], setCustomerLogoUrl = _d[1];
    var _e = React.useState(''), connectorName = _e[0], setConnectorName = _e[1];
    var sendAuthorizeRequest = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            authorizeConnector('test_url', connectorName, 'test_token', 'connection_id_placeholder');
            return [2 /*return*/];
        });
    }); };
    var renderAppStep = function () {
        switch (currentStep) {
            case 0:
                return React.createElement(StartPage, { customerName: customerName, customerLogoUrl: customerLogoUrl, setCurrentStep: setCurrentStep });
            case 1:
                return React.createElement(ConnectorPage, { customerName: customerName, customerLogoUrl: customerLogoUrl, currentStep: currentStep, setCurrentStep: setCurrentStep, setConnectorName: setConnectorName });
            case 2:
                return React.createElement(ResultPage, { customerName: customerName, customerLogoUrl: customerLogoUrl, currentStep: currentStep, setCurrentStep: setCurrentStep, connectorName: connectorName, setShowModal: setShowModal });
            default:
                return React.createElement(StartPage, { customerName: customerName, customerLogoUrl: customerLogoUrl, setCurrentStep: setCurrentStep });
        }
    };
    return (React.createElement("div", { className: "App" },
        React.createElement(Modal, { show: showModal, size: "xl", onClose: function () { return setShowModal(false); } }, renderAppStep())));
};
export default App;
