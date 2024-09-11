import "./App.css";
import {ReactFlowProvider} from "@xyflow/react"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth, UserStateProvider, supabase } from "@/hooks/useAuth";
import DeploymentPage from "@/pages/deployment";
import MonitoringPage from "@/pages/monitoring";
import SecretsPage from "@/pages/secrets";
import SettingsPage from "@/pages/settings";
import LoginPage from "@/pages/auth/LoginPage";
import { FinicAppContextProvider } from "@/hooks/useFinicApp";

function App() {
  const { session, setSession } = useAuth();

  const renderLoginRoutes = () => {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  };

  const renderAppRoutes = () => {
    return (
      <FinicAppContextProvider>
        <Routes>
          <Route path="/" element={<DeploymentPage />} />
          <Route path="/deployment" element={<DeploymentPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/secrets" element={<SecretsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </FinicAppContextProvider>
    );
  }

  return (
    <Router>
      <UserStateProvider session={session}>
        {session ? renderAppRoutes() : renderLoginRoutes()}
      </UserStateProvider>
    </Router>
  );
}

export default App;
