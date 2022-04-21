export const UserDashboard = () => {

    return(
        <div>
            <h1>Dashboard</h1>
            <div style={{display: 'flex', 'flex-direction': 'column','align-items':'center'}}>
                <div style={{'margin-bottom': '20px'}}>TVL $99,999,999</div>
                <div style={{display: 'flex', 'flex-direction': 'row'}}>
                    <div style={{display: 'flex', 'flex-direction': 'column', 'align-items':'center','background-color': 'white', 'padding': '20px','border-radius':'5px','margin-right': '20px'}}>
                        <div className="gradientUnderline">Acacia Staking</div>
                        <p> 10 days <br/> 999 (xx%) </p>
                        <p> 30 days <br/> 999 (xx%) </p>
                        <p> 90 days <br/> 999 (xx%) </p>
                    </div>
                    <div style={{display: 'flex', 'flex-direction': 'column', 'align-items':'center','background-color': 'white', 'padding': '20px','border-radius':'5px','margin-right': '20px'}}>
                        <div className="gradientUnderline">LP Lending</div>
                        <p> Lending amount <br/> 999 (xx%)</p>
                        <p> Lendable amount <br/> 999 (xx%) </p>
                    </div>
                    <div style={{display: 'flex', 'flex-direction': 'column', 'align-items':'center','background-color': 'white', 'padding': '20px','border-radius':'5px'}}>
                        <div className="gradientUnderline">ETF</div>
                        <p>ETF Amount (KUSDT) <br/> 999</p>
                        <p>Number of ETFs<br/> 3</p>
                    </div>
                </div>
            </div>
        </div>
    )
}