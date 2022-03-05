import {klaytn, caver} from "../caver";
import Kip7Abi from "../abis/Kip7Abi.json";
import BigNumber from "bignumber.js";
import AcaciaPoolAbi from "../abis/AcaciaPoolAbi.json";
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';
import { useEffect, useState} from "react";

export const StakingClaim = (props) => {
    const [earnedRewards, setEarnedRewards] = useState(0);
    const [poolBalance, setPoolBalance] = useState(0);
    const [autoStaking, setAutoStaking] = useState(true);

    const poolItem=props.poolItem
    const poolAddress=poolItem.poolAddr
    const tokenAddress=poolItem.tokenAddr
    const userWalletAddress = klaytn.selectedAddress
    // const caver = new Caver('https://kaikas.cypress.klaytn.net:8651');
    const poolInstance = new caver.klay.Contract(AcaciaPoolAbi, poolAddress);
    const tokenInstance = new caver.klay.Contract(Kip7Abi, tokenAddress);

    useEffect(()=>{
        const getData = async() => {
            await poolInstance.methods.displayReward().send({from: userWalletAddress, gas: 1000000});
            var earnedRewards = await poolInstance.methods.rewardView(userWalletAddress).call();
            earnedRewards = shiftdown(BigNumber(earnedRewards[0]), -18);
            setEarnedRewards(earnedRewards);
            const poolBalance = shiftdown(BigNumber(await poolInstance.methods.balanceOf(userWalletAddress).call()), -18);
            setPoolBalance(poolBalance);
        }
        getData();
    })

    // utility function
    function shiftup(num, n) // << , num is BigNumber
    {
        if(n < 0) console.log("SHIFTUP WARNING");
        var result = num.multipliedBy(Math.pow(10, n));
        return BigNumber(result.toFixed(0));
    }

    function shiftdown(num, n) // >> , num is BigNumber
    {
        if(n > 0) console.log("SHIFTDOWN WARNING");
        var result = num.multipliedBy(Math.pow(10, n));
        return result.toFixed(6);
    }

    const AutoStakingSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#99AE93',
            '&:hover': {
                backgroundColor: alpha('#99AE93', theme.palette.action.hoverOpacity),
            },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#99AE93',
        },
    }));

    const handleAutoStakingCheck = event => {
        setAutoStaking(event.target.checked);
    };

    function ClaimButton() {
        if (!autoStaking) {
            return (
                <div className="threeDButton" onClick={claimToWallet}
                     style={{'margin-top': '0px', 'margin-left': '100px'}}>
                    Claim
                </div>
            )
        }
        else {
            return (
                <div className="threeDButton" onClick={claimToStaking}
                     style={{'margin-top': '0px', 'margin-left': '100px'}}>
                    Claim
                </div>
            )
        }
    }

    const claimToWallet = async() => {
        await poolInstance.claimReward_To_Wallet().send({from: userWalletAddress, gas: 100000000}, function(error, transactionHash){
            if(error) return error;
            return transactionHash;
        });
    }

    const claimToStaking = async() => {
        await poolInstance.claimReward_To_Staking().send({from: userWalletAddress, gas: 100000000}, function(error, transactionHash){
            if(error) return error;
            return transactionHash;
        });
    }

    return(
        <div style={{'display': 'flex', 'flex-direction': 'column', 'column-gap':'10px', 'justify-content':'center','margin-left':'30px', 'width':'300px','height':'225px'}}>
            <h4 className="ButtonClaimSelected" style={{display: 'flex', 'justify-content':'center'}}>
                Claim
            </h4>
            <div style={{'display': 'flex', 'flex-direction': 'row','height':'140px','margin-top':'15px', 'justify-content':'center'}}>
                <div style={{'display': 'flex', 'flex-direction': 'column', 'column-gap':'10px'}}>
                    <div style={{'margin-top':'5px'}}>Earned Rewards:</div>
                    <div style={{'margin-top':'10px'}}>Pool Balance: </div>
                    <div style={{'margin-top':'10px'}}>Automatic Staking: </div>
                </div>
                <div style={{'display': 'flex', 'flex-direction': 'column', 'margin-left':'40px', 'column-gap':'5px'}}>
                    <div style={{'margin-top':'5px'}}> {earnedRewards} {poolItem.tokenLabel} </div>
                    <div style={{'margin-top':'10px'}}> {poolBalance} {poolItem.tokenLabel} </div>
                    <div style={{'display': 'flex', 'flex-direction': 'row', 'align-items':'center','margin-top':'2px'}}>
                        <div>Off</div> <AutoStakingSwitch defaultChecked checked={autoStaking} onChange={handleAutoStakingCheck}/> <div>On</div>
                    </div>
                </div>
            </div>
            <ClaimButton/>
        </div>
    )
}