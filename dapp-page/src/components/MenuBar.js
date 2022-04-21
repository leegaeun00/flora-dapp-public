import { Link } from 'react-router-dom';

export const MenuBar =() => {
    return (
        <div className="menuBar">
            {/*<Link to={'/'||`/IDO`} className="service">IDO</Link>*/}
            {/*<Link to={'/Staking'} className="service">Staking</Link>*/}
            {/*<Link to={`/Lending`} className="service">Lending</Link>*/}
            {/*<Link to={`/ETF`} className="service">ETF</Link>*/}
            {/*<Link to={`/PoolTogether`} className="service" style={{"width":"120px"}}>Pool Together</Link>*/}
            {/*<Link to={`/UserDashboard`} className="service">Dashboard</Link>*/}
            <div title="Will be released soon"><Link to={'#'} className="service">Staking</Link></div>
            <div title="Will be released soon"><Link to={'#'} className="service">Lending</Link></div>
            <div title="Will be released soon"><Link to={'#'} className="service">ETF</Link></div>
            <div title="Will be released soon"><Link to={'#'} className="service">PoolTogether</Link></div>
            <div title="Will be released soon"><Link to={'#'} className="service">UserDashboard</Link></div>
        </div>
    )
}