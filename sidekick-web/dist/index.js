import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from 'react';
import "./index.css";
import { Flowbite } from "flowbite-react";
import App from "./App";
var container = document.getElementById("root");
if (typeof window.global === 'undefined') {
    window.global = window;
}
if (!container) {
    throw new Error("React root element doesn't exist!");
}
var root = createRoot(container);
var SidekickModal = function () {
    return (React.createElement(Flowbite, null,
        React.createElement(App, null)));
};
export default SidekickModal;
root.render(React.createElement(StrictMode, null,
    React.createElement(Flowbite, null,
        React.createElement(App, null))));
