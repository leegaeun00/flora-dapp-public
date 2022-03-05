import Fab from "@mui/material/Fab";
import Tooltip from '@mui/material/Tooltip';
import {useState, useEffect} from "react";
import {klaytn, caver} from "../caver.js";

export const ConnectWallet = () => {
    const [walletAddressShortened, setWalletAddressShortened] = useState("none")
    const [isWalletConnected, setIsWalletConnected] = useState("Kaikas not installed")
    // There are 3 states of isWalletConnected: Kaikas not installed, Kaikas not connected, Cypress not connected

    console.log("isWalletConnected", isWalletConnected)
    // console.log(klaytn._kaikas.isEnabled())

    //check if wallet is connected
    useEffect(()=> {
        //(1) check if Kaikas is installed
        const checkIsKaikasInstalled = async () => {
            if (klaytn === undefined) {
                setIsWalletConnected("Kaikas not installed");
            } else {
                //(2) check if Kaikas is connected
                const checkIsKaikasConnected = async () => {
                    if (!klaytn._kaikas.isEnabled()) {
                        setIsWalletConnected("Kaikas not connected")
                    } else {
                        //(3) check if Cypress is connected
                        const checkIsCypressConnected = async () => {
                            const network = await klaytn.networkVersion
                            if (network !== 8217) {
                                setIsWalletConnected("Cypress not connected")
                            } else {
                                setIsWalletConnected("Cypress connected")
                            }
                        }
                        checkIsCypressConnected()
                    }
                }
                checkIsKaikasConnected()
            }
        }
        checkIsKaikasInstalled()
        //dependency currently not working, need to refresh
    }, [klaytn.networkVersion, klaytn._kaikas.isEnabled(), klaytn])

    console.log(isWalletConnected)
    //connect to Kaikas
    const connectWallet = async() => {
        console.log("connect wallet clicked")
        try {
            await klaytn.enable();
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (isWalletConnected==="Cypress connected" || isWalletConnected==="Cypress not connected") {
            const walletAddress = klaytn.selectedAddress;
            console.log("walletAddress", walletAddress)
            const walletAddressShortened = walletAddress.substr(0,5) + " ... " + walletAddress.substr(-3,3)
            console.log("walletAddressShortened", walletAddressShortened)
            setWalletAddressShortened(walletAddressShortened)
        }
    //dependency currently not working, need to refresh
    },[isWalletConnected,klaytn.selectedAddress])

    //tooltip does not open yet, need to add open variable
    if (isWalletConnected==="Kaikas not installed"){
        return (
            <Tooltip title="Install Kaikas wallet first to connect">
                <Fab variant="extended" disabled
                     style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", fontSize: "15px", textTransform: 'none'}}>
                    Connect Wallet
                </Fab>
            </Tooltip>
        )
    } else if (isWalletConnected==="Kaikas not connected"){
        return (
            <Tooltip title={"Click to start your Flora investment"}>
                <Fab variant="extended" onClick = {()=>connectWallet()}
                     style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", fontSize: "15px", textTransform: 'none'}}>
                    Connect Wallet
                </Fab>
            </Tooltip>
        )
    } else if (isWalletConnected==="Cypress not connected"){
        return (
            <Tooltip title="Connect to Cypress Main Network">
                <Fab variant="extended" disabled
                     style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", fontSize: "15px", textTransform: 'none'}}>
                    {walletAddressShortened}
                </Fab>
            </Tooltip>
        )
    } else if (isWalletConnected==="Cypress connected") {
        return (
            <Fab variant="extended"
                 style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", fontSize: "15px", textTransform: 'none'}}>
                {walletAddressShortened}
            </Fab>
        )
    } else {
        return(
            <Fab variant="extended" disabled
                 style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", fontSize: "15px", textTransform: 'none'}}>
                Loading...
            </Fab>
        )
    }

}