import { Link } from 'react-router-dom';
import {ConnectWallet} from "./ConnectWallet.js";

export const MenuBar =() => {
    return (
        <div className="menuBar">
            <div>
                <Link to={`/`||'/Staking'} className="service">Staking</Link>
                <Link to={`/Lending`} className="service">Lending</Link>
                <Link to={`/UserDashboard`} className="service">Dashboard</Link>
            </div>
            <ConnectWallet/>
        </div>
    )
}