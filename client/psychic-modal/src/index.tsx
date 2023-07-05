import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Flowbite } from "flowbite-react";
import App from "./App";
import RedirectPage from "./oauth/redirect";
import { ModalProvider } from "./context/ModalContext";

const container = document.getElementById("root");

if (typeof (window as any).global === "undefined") {
  (window as any).global = window;
}

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <Flowbite>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ModalProvider>
                <App />
              </ModalProvider>
            }
            index
          />
          <Route path="/oauth/redirect" element={<RedirectPage />} />
        </Routes>
      </BrowserRouter>
    </Flowbite>
  </StrictMode>
);
