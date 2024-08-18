import "./App.css";
import {ReactFlowProvider} from "@xyflow/react"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth, UserStateProvider, supabase } from "@/hooks/useAuth";
import WorkflowList from "@/pages/home";
import WorkflowPage from "@/pages/workflow";
import LoginPage from "@/pages/auth/LoginPage";
import { WorkflowProvider } from "@/hooks/useWorkflow";

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
      <Routes>
        <Route path="/" element={<WorkflowList />} />
        <Route
          path="/workflow/:id"
          element={
            <ReactFlowProvider>
              <WorkflowProvider>
                <WorkflowPage />
              </WorkflowProvider>
            </ReactFlowProvider>
          }
        />
        </Routes>
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
