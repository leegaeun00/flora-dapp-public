import {IdoCountDownTimer} from './IdoCountDownTimer.js';
import {useEffect, useState} from "react";
import BigNumber from "bignumber.js";
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import CircleIcon from '@mui/icons-material/Circle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import HelpIcon from '@mui/icons-material/Help'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';
import {styled} from "@mui/material/styles";

import Kip7Abi from '../abis/Kip7Abi.json';
import IdoAbi from "../abis/IdoAbi.json";
import {caver, klaytn} from "../caver";
import acaColorLogo from "../images/acaColorLogo.png";

//NumberInputBox
const NumberInput = styled(TextField) ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'lightgrey',
            borderWidth: '2px'
        },
        '&:hover fieldset': {
            borderColor: '#99AE93',
            borderWidth: '2px'
        },
        '&.Mui-focused fieldset': {
            borderColor: '#99AE93',
            borderWidth: '2px'
        },
    },
    'margin-top': '10px',
    'margin-right': '20px',
    'font-size':'17px',
    'width': '350px',
})

export const IDO = () => {
    //timeStatus: "untilIdoStart", "untilIdoEnd", "untilVestingStart", "untilVestingEnd", "vestingEnd"
    const [timeStatus, setTimeStatus] = useState("");
    const [isHardCap, setIsHardCap] = useState(false);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [userWalletKlayBalance, setUserWalletKlayBalance] = useState(0);
    const [userKlay, setUserKlay] = useState(0);
    const [userTotalAca, setUserTotalAca] = useState(0);
    const [userClaimedAca, setUserClaimedAca] = useState(0);
    const [userLockedAca, setUserLockedAca] = useState(0);
    const [userClaimableAca, setUserClaimableAca] = useState(0);
    const [soldAcaInKlay, setSoldAcaInKlay] = useState(0);
    const [soldAcaPercentage, setSoldAcaPercentage] = useState(0);
    const [barWidthStyle, setBarWidthStyle] = useState({opacity: 0,width: `0%`});
    const [isConnectWalletAlert, setIsConnectWalletAlert] = useState(false);
    const [isInvalidInputAlert, setIsInvalidInputAlert] = useState(false);

    const idoAddress="0xdD109f3cd57AD0aA3523dBc13FC669185a0dB63f";
    const userWalletAddress = klaytn?.selectedAddress
    const idoInstance = new caver.klay.Contract(IdoAbi, idoAddress);
    const personalCap = 3000

    useEffect(() => {
        const timerId = setTimeout(async () => {
            await checkTimeStatus();
            await getData();
            await updateBarWidthStyle();
        }, 3000);
        return () => {
            clearTimeout(timerId);
        }
    });

    const checkTimeStatus = async () => {
        //20:00 KST is equivalent to 12:00 UTC during daylight saving
        //month:3 is equivalent to April, hours:11 is equivalent to 12:00pm noon
        const idoStart = new Date(Date.UTC(2022,3,22,11,0))
        const idoEnd = new Date(Date.UTC(2022,3,29,11,0))
        const vestingStart = new Date(Date.UTC(2022,4,13,11,0))
        //vesting ends after 40 days of start of vesting
        const vestingEnd = new Date(Date.UTC(2022,5,22,11,0))
        const date = new Date();
        const current = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));

        if (idoStart-current >=0) {
            setTimeStatus("untilIdoStart")
        } else if (idoEnd-current >=0){
            setTimeStatus("untilIdoEnd")
        } else if (vestingStart-current >=0){
            setTimeStatus("untilVestingStart")
        } else if (vestingEnd >=0){
            setTimeStatus("untilVestingEnd")
        } else {
            setTimeStatus("vestingEnd")
        }
    }

    const getData = async() => {
        var userWalletKlayBalance = shiftdown(BigNumber(await caver.klay.getBalance(userWalletAddress)), -18);
        setUserWalletKlayBalance(userWalletKlayBalance);

        if (timeStatus==="untilIdoEnd") {
            var soldAcaInKlay = await BigNumber(await idoInstance.methods.KlayInContract().call());
            soldAcaInKlay = await shiftdown(soldAcaInKlay, -18);
            await setSoldAcaInKlay(soldAcaInKlay);

            await setSoldAcaPercentage(soldAcaInKlay * 100 / 10);

            var isHardCap = Number(await idoInstance.methods.viewHardCapIsOver().call());
            if (isHardCap) {
                await setIsHardCap(true)
            } else {
                await setIsHardCap(false)
            }

            var userKlay = await BigNumber(await idoInstance.methods.viewAmountOfUserKlay(userWalletAddress).call());
            userKlay = await shiftdown(userKlay, -18);
            await setUserKlay(userKlay);

            var userTotalAca = await BigNumber(await idoInstance.methods.viewUserPrincipal(userWalletAddress).call());
            userTotalAca = await shiftdown(userTotalAca, -18);
            await setUserTotalAca(userTotalAca)
        }

        var userClaimableAca = await BigNumber(await idoInstance.methods.viewClaimable(userWalletAddress).call());
        userClaimableAca = await shiftdown(userClaimableAca, -18);
        await setUserClaimableAca(userClaimableAca);

        var userLockedAca = await BigNumber(await idoInstance.methods.viewAmountOfUser(userWalletAddress).call());
        userLockedAca = await shiftdown(userLockedAca, -18);
        await setUserLockedAca(userLockedAca-userClaimableAca);
        
        if(isNaN(userTotalAca)) userTotalAca = 0;
        await setUserClaimedAca(userTotalAca - userLockedAca)
    }

    const updateBarWidthStyle = async() => {
        const newBarWidthStyle = {
            opacity: 1,
            width: `${soldAcaPercentage}%`
        }
        setBarWidthStyle(newBarWidthStyle);
    }

    const IdoData = () => {
        return (
            <div style={{'display': 'flex', 'flex-direction': 'column','justify-content':'center',"margin-left":"23%", "margin-top":"60px"}}>
                <h4 className="idoLabel" style={{'display': 'flex', "align-items":"center",'width':'450px','font-size':'18px'}}>
                    Total Raise Amount (KLAY) <HelpIcon onClick={() => window.open('https://flora-finance.gitbook.io/flora.finance/ido/ido-information')} style={{'fontSize': '22px', 'color':'#C9D3C5','margin-left':'10px'}}/>
                </h4>
                <div></div>
                <div style={{"font-size":"15px",'margin-top':'10px', "margin-left":"15px","width":"420px","text-align":"right", 'color':'#d8d8d8', 'font-weight':'700'}}>(Total ACA for sale: 2,250,000 ACA)</div>
                <div className="saleProgressBar" style={{'margin-top':'2px', "margin-left":"15px"}}>
                    <div className="saleProgressBarFilling" style={barWidthStyle}>
                        {soldAcaPercentage>=10 ?
                            <div style={{"font-size":"14px",'font-weight':'700'}}>{Math.round(soldAcaPercentage)}% &nbsp;</div>
                            :
                            <div></div>
                        }
                    </div>
                    <div style={{'display': 'flex', 'flex-direction': 'row'}}>
                        <div style={{'width':'28.57%', 'height':'65px', 'border-right': '2px dotted #d8d8d8'}}>
                            <div style={{'text-align':'right','font-size':'15px','margin-top':'10px', 'margin-right':'5px', 'color':'#C9D3C5', 'font-weight':'700'}}>
                                Soft Cap <br/>
                                200,000 KLAY <br/>
                                <span style={{'font-size':'13px'}}>(1 ACA = 0.2 KLAY)</span>
                            </div>
                        </div>
                        <div style={{'width':'71.43%','height':'65px', 'border-right': '2px dotted #d8d8d8'}}>
                            <div style={{'text-align':'right','font-size':'15px','margin-top':'10px', 'margin-right':'5px','color':'#C9D3C5', 'font-weight':'700'}}>
                                Hard Cap <br/>
                                700,000 KLAY <br/>
                                <span style={{'font-size':'13px'}}>(1 ACA = 0.4 KLAY)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <h4 className="idoLabel" style={{"display":"flex", "align-items":"center","width":"450px", "margin-top":"110px",'font-size':'18px'}}>
                    Your IDO details <HelpIcon onClick={() => window.open('https://flora-finance.gitbook.io/flora.finance/ido/how-to-participate')} style={{'fontSize': '22px', 'color':'#C9D3C5','margin-left':'10px'}}/>
                </h4>
                {/*<div style={{"width":"450px", "margin-top":"100px",'font-size':'18px'}}>Your IDO details</div>*/}
                {/*<div style={{'display': 'flex', 'flex-direction': 'row','height':'140px','width':'450px','margin-top':'10px','justify-content':'center'}}>*/}
                <div style={{'display': 'flex', 'flex-direction': 'row','height':'140px','width':'450px','margin-top':'5px','justify-content':'center'}}>
                    <div style={{'display': 'flex', 'flex-direction': 'column', 'column-gap':'10px'}}>
                        <div style={{'margin-top':'15px','font-size':'18px', 'color':'#C9D3C5', 'font-weight':'700'}}> Invested KLAY </div>
                        <div style={{'margin-top':'15px','font-size':'18px', 'color':'#C9D3C5', 'font-weight':'700'}}> Total owned ACA </div>
                        <div style={{'margin-top':'15px','font-size':'18px', 'color':'#C9D3C5', 'font-weight':'700'}}> Claimable ACA </div>
                        <div style={{'margin-top':'15px', 'font-size':'18px', 'color':'#C9D3C5', 'font-weight':'700'}}> Claimed ACA </div>
                        <div style={{'margin-top':'15px', 'font-size':'18px', 'color':'#C9D3C5', 'font-weight':'700'}}> Locked ACA </div>
                    </div>
                    <div style={{'display': 'flex', 'flex-direction': 'column', 'margin-left':'40px', 'column-gap':'5px'}}>
                        <div style={{'margin-top':'15px','font-size':'18px', 'color':'#99c199', 'font-weight':'700'}}> {Number(userKlay).toFixed(5)} KLAY </div>
                        <div style={{'margin-top':'15px','font-size':'18px', 'color':'#99c199', 'font-weight':'700'}}> {Number(userTotalAca).toFixed(5)} ACA </div>
                        <div style={{'margin-top':'15px','font-size':'18px', 'color':'#99c199', 'font-weight':'700'}}> {Number(userClaimableAca).toFixed(5)} ACA </div>
                        <div style={{'margin-top':'15px','font-size':'18px', 'color':'#99c199', 'font-weight':'700'}}> {Number(userClaimedAca).toFixed(5)} ACA </div>
                        <div style={{'margin-top':'15px','font-size':'18px', 'color':'#99c199', 'font-weight':'700'}}> {Number(userLockedAca).toFixed(5)} ACA </div>
                    </div>
                </div>
            </div>
        )
    }

    const IdoPurchaseAcacia = () => {
        return (
            // <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content':'center', 'margin-left':'30%', 'margin-top':'80px'}}>
            <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content':'center', "margin-left":"23%",'width':'450px', 'margin-top':'80px'}}>
                {/*<h4 className="idoLabel" style={{display: 'flex', 'justify-content':'center', 'align-items':'center', 'margin-left':'16%','font-size':'18px'}}>*/}
                <h4 className="idoLabel" style={{display: 'flex', 'width':'450px','font-size':'18px'}}>
                    Purchase ACA <img alt='acaColorLogo' src={acaColorLogo} style={{'width':'20px', 'margin-left': '5px'}}/>
                </h4>
                {isConnectWalletAlert?
                    <ConnectWalletAlert marginTop={'35px'}/>:
                    <div></div>
                }
                {isInvalidInputAlert?
                    <InvalidInputAlert/>:
                    <div></div>
                }
                <div style={{'display': 'flex', 'flex-direction': 'column', 'align-items':'center','justify-content':'center'}}>
                    <div style={{'margin-top': '5px','font-size':'15px','width':'350px', 'color':'#d8d8d8', 'font-weight':'700'}}>Wallet Balance: {Number(userWalletKlayBalance).toFixed(5)} KLAY</div>
                    <NumberInput variant="outlined" value={tokenAmount} onChange={(e)=>setTokenAmount(e.target.value)}
                                 // inputProps={{style : {'color':'#99c199', 'font-weight':'700'}}}
                                 InputProps={{ endAdornment: (<InputAdornment position="end">KLAY</InputAdornment>)}} />
                    <div style={{'display':'flex', 'flex-direction':'row', 'column-gap':'10px'}}>
                        <div className="threeDButtonDarker" onClick={()=> {
                            if (userWalletKlayBalance <=3){
                                setTokenAmount(userWalletKlayBalance*0.25)
                            }else if (personalCap>=userWalletKlayBalance){
                                setTokenAmount((userWalletKlayBalance-3)*0.25)
                            } else {
                                setTokenAmount((personalCap-3)*0.25)
                            }
                        }} style={{'margin-top': '8px', 'margin-left': '1px','justify-content':'center','align-items':'center','height':'20px','width':'25px'}}>
                        {/*<div className="threeDButton" style={{'margin-top': '8px', 'margin-left': '1px','justify-content':'center','align-items':'center','height':'25px','width':'50px'}}>*/}
                            25%
                        </div>
                        <div className="threeDButtonDarker" onClick={()=> {
                            if (userWalletKlayBalance <=3){
                                setTokenAmount(userWalletKlayBalance*0.5)
                            }else if (personalCap>=userWalletKlayBalance){
                                setTokenAmount((userWalletKlayBalance-3)*0.5)
                            } else {
                                setTokenAmount((personalCap-3)*0.5)
                            }
                        }} style={{'margin-top': '8px', 'margin-left': '1px','justify-content':'center','align-items':'center','height':'20px','width':'25px'}}>
                            {/*<div className="threeDButton" style={{'margin-top': '8px', 'margin-left': '1px','justify-content':'center','align-items':'center','height':'25px','width':'50px'}}>*/}
                            50%
                        </div>
                        <div className="threeDButtonDarker" onClick={()=> {
                            if (userWalletKlayBalance <=3){
                                setTokenAmount(userWalletKlayBalance*0.75)
                            }else if (personalCap>=userWalletKlayBalance){
                                setTokenAmount((userWalletKlayBalance-3)*0.75)
                            } else {
                                setTokenAmount((personalCap-3)*0.75)
                            }
                        }} style={{'margin-top': '8px', 'margin-left': '1px','justify-content':'center','align-items':'center','height':'20px','width':'25px'}}>
                            {/*<div className="threeDButton" style={{'margin-top': '8px', 'margin-left': '1px','justify-content':'center','align-items':'center','height':'25px','width':'50px'}}>*/}
                            75%
                        </div>
                        <div className="threeDButtonDarker" onClick={()=> {
                            if (userWalletKlayBalance <=3){
                                setTokenAmount(userWalletKlayBalance)
                            }else if (personalCap>=userWalletKlayBalance){
                                setTokenAmount(userWalletKlayBalance-3)
                            } else {
                                setTokenAmount(personalCap-3)
                            }
                        }} style={{'margin-top': '8px','justify-content':'center','align-items':'center','height':'20px','width':'30px'}}>
                            {/*<div className="threeDButton" style={{'margin-top': '8px', 'margin-left': '1px','justify-content':'center','align-items':'center','height':'25px','width':'50px'}}>*/}
                            MAX
                        </div>
                    </div>
                    { ((timeStatus==="untilIdoStart") || (isHardCap===true)) ?
                        <PurchaseButtonDisabled/> :
                        <PurchaseButton/>
                    }
                </div>
            </div>
        )
    }

    const IdoClaimAcacia = () => {
        return (
            // <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content':'center', 'margin-left':'33%', 'margin-top':'75px'}}>
            //     <h4 className="idoLabel" style={{display: 'flex', 'justify-content':'center', 'align-items':'center','margin-left':'15%'}}>
            <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content':'center', "margin-left":"23%",'width':'450px', 'margin-top':'80px'}}>
                {/*<h4 className="idoLabel" style={{display: 'flex', 'justify-content':'center', 'align-items':'center', 'margin-left':'16%','font-size':'18px'}}>*/}
                <h4 className="idoLabel" style={{display: 'flex', 'width':'450px','font-size':'18px'}}>
                    Claim ACA <img alt='acaColorLogo' src={acaColorLogo} style={{width:'18px', 'margin-left': '5px'}}/>
                </h4>
                {isConnectWalletAlert?
                    <ConnectWalletAlert marginTop={'150px'}/>:
                    <div></div>
                }
                <div style={{'display':'flex','justify-content':'center'}}>
                    <ClaimButton/>
                </div>
            </div>
        )
    }

    //PurchaseButton
    function PurchaseButton() {
        return (
            <div className="threeDButton" onClick={purchase} style={{'margin-top': '20px', 'font-size':'16px'}}>
                Purchase
            </div>
        )
    }

    //DisabledPurchaseButton
    function PurchaseButtonDisabled() {
        return (
            <div className="threeDButtonDisabled" style={{'margin-top': '20px', 'font-size':'16px'}}>
                Purchase
            </div>
        )
    }

    //ClaimButton
    function ClaimButton() {
        return (
            <div className="threeDButton" onClick={claim} style={{'font-size':'16px'}}>
                Claim
            </div>
        )
    }

    //ConnectWalletAlert
    function ConnectWalletAlert(props) {
        return (
            <Alert severity="info" style={{'font-family': 'Raleway','position': 'absolute','z-index':'1','width':'420px','height':'125px','margin-top':props.marginTop}}>
                <AlertTitle style={{'font-family': 'Raleway','display':'flex','align-items':'center'}}>Please connect wallet first. <CloseIcon onClick={() => setIsConnectWalletAlert(false)} style={{'fontSize': '22px','margin-left':'160px'}}/></AlertTitle>
                If Kaikas wallet is locked, unlock Kaikas. <br/>
                If Kaikas wallet is not installed yet, install Kaikas. <br/>
                If not connected to Cypress Main Network, change network to Cypress.
            </Alert>
        )
    }

    //InvalidInputAlert
    function InvalidInputAlert() {
        return (
            <Alert severity="info" style={{'font-family': 'Raleway','position': 'absolute','z-index':'1','width':'420px','height':'90px','margin-top':'50px'}}>
                <AlertTitle style={{'font-family': 'Raleway','display':'flex','align-items':'center',}}>Please input a valid number. <CloseIcon onClick={() => setIsInvalidInputAlert(false)} style={{'fontSize': '22px','margin-left':'150px'}}/></AlertTitle>
                Number should be larger than 0 and less than <br/> your wallet balance.
            </Alert>
        )
    }

    // const checkSoftHardCapStatus = async() => {
    //     var softBool = Number(await idoInstance.methods.viewSoftCapIsOver().call());
    //     var hardBool = Number(await idoInstance.methods.viewHardCapIsOver().call());
    //     if(!hardBool){
    //         if(!softBool) {
    //             setSoftHardCapStatus("beforeSoftCap")
    //         } else {
    //             setSoftHardCapStatus("beforeHardCap")
    //         }
    //         return;
    //     }
    //     setSoftHardCapStatus("hardCap")
    // }

    //purchase
    const purchase = async() => {
        if(!userWalletAddress){
            setIsConnectWalletAlert(true);
            return -1
        }
        if(tokenAmount <= 0||tokenAmount > userWalletKlayBalance){
            setIsInvalidInputAlert(true);
            return -1
        };
        var _amount = shiftup(BigNumber(tokenAmount), 18);
        // await checkSoftHardCapStatus();
        // if(softHardCapStatus==="beforeSoftCap"){

        //     await idoInstance.methods.softCapStake().send({from: userWalletAddress, gas: 10000000, value: _amount});
        // }
        // else if(softHardCapStatus==="beforeHardCap"){
        //     await idoInstance.methods.hardCapStake().send({from: userWalletAddress, gas: 10000000, value: _amount});
        // }
        // else{
        //     return -1;
        // }
        // return 0;
        await idoInstance.methods.stake().send({from: userWalletAddress, gas: 10000000, value: _amount});
    }

    //claim
    const claim = async() => {
        if(!userWalletAddress){
            setIsConnectWalletAlert(true);
            return -1
        }
        var valid = Number(await idoInstance.methods.viewAmountOfUser(userWalletAddress).call());
        if(!valid) return -1;
        await idoInstance.methods.vestingPeriodClaim().send({from: userWalletAddress, gas: 10000000});
    }


    // utility function
    // shiftup << , num is BigNumber
    const shiftup = (num, n) =>
    {
        if(n < 0) console.log("SHIFTUP WARNING");
        const result = num.multipliedBy(Math.pow(10, n));
        return BigNumber(result.toFixed(0));
    }

    // shiftdown << , num is BigNumber
    const shiftdown = (num, n) => // >> , num is BigNumber
    {
        if(n > 0) console.log("SHIFTDOWN WARNING");
        const result = num.multipliedBy(Math.pow(10, n));
        return result.toFixed(6);
    }

    return(
        <div style={{"display":"flex", "flex-direction":"column","align-items":"center"}}>
            <div style={{"display":"flex", "flex-direction":"row","align-items":"center"}}>
                <RocketLaunchIcon style={{'fontSize': '50px', 'color':'black','margin-right':'10px'}}/>
                <h1 style={{'width':'1000px','color':'black','font-size':'50px'}}>IDO</h1>
            </div>
            <div className="idoBox"  style={{"display":"flex", "flex-direction":"column", "justify-content":"center", "align-items":"center"}}>
                <IdoCountDownTimer/>
                {timeStatus===("untilIdoStart"||"untilIdoEnd") ?
                    <div style={{"background-color": "white", "border-radius":"5px","boxShadow":"2px 2px 2px #9E9E9E",
                        "width":"800px", "height":"1000px", "margin-top":"35px", "display":"flex","flex-direction":"column"}}>
                        <IdoData/>
                        <div>{IdoPurchaseAcacia()}</div>
                    </div>
                    :
                    <div style={{"background-color": "white", "border-radius":"5px","boxShadow":"2px 2px 2px #9E9E9E",
                        "width":"800px", "height":"870px", "margin-top":"35px", "display":"flex","flex-direction":"column"}}>
                        <IdoData/>
                        <IdoClaimAcacia/>
                    </div>
                }
            </div>
        </div>
    )
}
