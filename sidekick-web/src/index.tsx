import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from 'react';


import "./index.css";
import { Flowbite } from "flowbite-react";
import App from "./App";

const container = document.getElementById("root");

if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

const SidekickModal = () => {
  return (
    <Flowbite>
      <App />
    </Flowbite>
  )
}
export default SidekickModal

root.render(
  <StrictMode>
    <Flowbite>
      <App />
    </Flowbite>
  </StrictMode>
);
