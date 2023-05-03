import React from 'react';
import {
  Button,
  Modal,
} from "flowbite-react";
import './App.css';
import Sidekick from "getsidekick"
import SidekickModal from 'getsidekick';

const App: React.FC = () => {

  return (
    <div className="App">
     <SidekickModal />
    </div>
  );
}

export default App;
