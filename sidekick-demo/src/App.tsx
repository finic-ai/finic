import React, { useEffect } from 'react';
import {
  Button,
  Modal,
} from "flowbite-react";
import './App.css';
import {useSidekickAuth} from "getsidekick"

const App: React.FC = () => {

  const publicKey = "5c362fda-bb72-4a6c-b930-71f33ad45f79"
  const connectionId = "2cbaa840-0b21-4d8e-924c-e418a08ce53f"
  const sidekickBaseUrl = "http://localhost:8080"

  const { authorize, loading, newConnection, error } = useSidekickAuth("notion", connectionId, publicKey, sidekickBaseUrl)
  useEffect(() => {
    authorize()

  }, [])

  return (
    <div className="App">
     {newConnection && <div>{newConnection}</div>}
    </div>
  );
}

export default App;
