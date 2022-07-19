import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Proposal from "./pages/Proposal";
import mercedes from "./images/mercedes.jpeg";
import {ConnectButton}  from "web3uikit";

const App = () => {
  return (
    <>
    <div className="header">


    <img width="100px" src={mercedes}/>

    <ConnectButton />


    </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proposal" element={<Proposal />} />
      </Routes>
    </>
  );
};

export default App;
