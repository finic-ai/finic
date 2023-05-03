import React from 'react';
import {
  Button,
  Modal,
} from "flowbite-react";
import './App.css';
import Sidekick from "../../sidekick-web/dist"
import SidekickModal from '../../sidekick-web/dist';

const App: React.FC = () => {

  return (
    <div className="App">
     <SidekickModal />
    </div>
  );
}

export default App;
