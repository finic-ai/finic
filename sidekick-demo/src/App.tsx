import React, { useEffect } from 'react';
import {
  Button,
  Modal,
} from "flowbite-react";
import './App.css';
import {useNotionOAuth} from "getsidekick"

const App: React.FC = () => {

  const publicKey = "5c362fda-bb72-4a6c-b930-71f33ad45f79"
  const connectionId = "2cbaa840-0b21-4d8e-924c-e418a08ce53f"

  const { authorize, authCode } = useNotionOAuth("notion", connectionId, publicKey)

  useEffect(() => {
    authorize()
  }, [])

  return (
    <div className="App">
     {/* <MyComponent text={'hello'} /> */}
    </div>
  );
}

export default App;
