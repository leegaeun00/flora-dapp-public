import {klaytn, caver} from "./caver.js";
import {useEffect, useState} from "react";
import {ConnectWallet} from "./components/ConnectWallet.js";
import {Staking} from "./components/Staking.js";
import {Lending} from "./components/Lending.js";
import {UserDashboard} from "./components/UserDashboard.js";
import {MenuBar} from "./components/MenuBar.js";
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './styles/style.css';

function App() {
  return (
    <Router>
        <MenuBar/>
        <Routes>
          <Route path="/" element={<Staking/>}/>
          <Route path="/Staking" element={<Staking/>}/>
          <Route path="/Lending" element={<Lending/>}/>
          <Route path="/UserDashboard" element={<UserDashboard/>}/>
        </Routes>
    </Router>
  );
}

export default App;
