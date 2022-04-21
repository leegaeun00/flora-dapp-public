import {klaytn, caver} from "./caver.js";
import {useEffect, useState} from "react";
import {AcaPrice} from "./components/AcaPrice.js";
import {Staking} from "./components/Staking.js";
import {Lending} from "./components/Lending.js";
import {Etf} from "./components/Etf.js";
import {UserDashboard} from "./components/UserDashboard.js";
import {PoolTogether} from "./components/PoolTogether.js";
import {IDO} from "./components/IDO.js";
import {MenuBar} from "./components/MenuBar.js";
import {ConnectWallet} from "./components/ConnectWallet.js";
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './styles/style.css';

function App() {
  return (
    <Router>
        <div style={{display: 'flex', 'flex-direction': 'row', 'justify-content':'center'}}>
            <AcaPrice/>
            {/*<div style={{'width': '900px'}}></div>*/}
            {/*<MenuBar/>*/}
            {/*<div style={{'width': '840px'}}></div>*/}
            {/*<ConnectWallet/>*/}
        </div>
        <Routes>
          <Route path="/" element={<IDO/>}/>
          <Route path="/IDO" element={<IDO/>}/>
          {/*<Route path="/Staking" element={<Staking/>}/>*/}
          {/*<Route path="/Lending" element={<Lending/>}/>*/}
          {/*<Route path="/ETF" element={<Etf/>}/>*/}
          {/*<Route path="/PoolTogether" element={<PoolTogether/>}/>*/}
          {/*<Route path="/UserDashboard" element={<UserDashboard/>}/>*/}
        </Routes>
    </Router>
  );
}

export default App;
