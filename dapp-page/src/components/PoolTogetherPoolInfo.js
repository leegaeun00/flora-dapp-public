import {klaytn, caver} from "../caver.js";
import Kip7Abi from '../abis/Kip7Abi.json';
import AcaciaPoolAbi from '../abis/AcaciaPoolAbi.json';
import acaColorLogo from "../images/acaColorLogo.png"

import BigNumber from "bignumber.js";
import {useState, useEffect} from "react";

export const PoolTogetherPoolInfo = (props) => {
    const poolItem=props.poolItem
    const poolAddress=poolItem.poolAddr
    const tokenAddress=poolItem.tokenAddr
    const userWalletAddress = klaytn.selectedAddress
    const poolInstance = new caver.klay.Contract(AcaciaPoolAbi, poolAddress);
    const tokenInstance = new caver.klay.Contract(Kip7Abi, tokenAddress);

    const [roundId, setRoundId] = useState(0);
    const [oneProbability, setOneProbability] = useState(0);
    const [poolBalance, setPoolBalance] = useState(0);
    const [userProbability, setUserProbability] = useState(0);

    useEffect(()=>{
        const getData = async() => {
            //may have to modify calling the below functions
            var roundId = shiftdown(BigNumber(await poolInstance.methods.currentIdCount().call()), -18);
            setRoundId(roundId);
            var oneProbability = shiftdown(BigNumber(await poolInstance.methods.oneProbability().call()), -18);
            setOneProbability(oneProbability);
            var userProbability = shiftdown(BigNumber(await poolInstance.methods.userProbability().call()), -18);
            setUserProbability(userProbability);
            var poolBalance = shiftdown(BigNumber(await poolInstance.methods.depositedLP().call()), -18);
            setPoolBalance(poolBalance);
        }
        getData();
    })

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
        <div style={{display: 'flex', 'flex-direction': 'column', 'row-gap':'10px', 'align-items':'center'}}>
            <div style={{display: 'flex', 'flex-direction': 'row', 'column-gap':'10px','align-items':'center'}}>
                <img alt='acaColorLogo' src={acaColorLogo} style={{width:'40px', margin: '10px', 'margin-left': '15px'}}/>
                <span style={{"font-weight":"bold"}}>{poolItem.tokenLabel} Round {roundId}</span>
            </div>
            <div> Base probability {oneProbability}%</div>
            <div> Deposited {poolBalance} {poolItem.tokenLabel} </div>
            <div> Your probability {userProbability}%</div>
        </div>
    )
}