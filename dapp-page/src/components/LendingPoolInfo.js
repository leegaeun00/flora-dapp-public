import {klaytn, caver} from "../caver.js";
import Kip7Abi from '../abis/Kip7Abi.json';
import AcaciaPoolAbi from '../abis/AcaciaPoolAbi.json';
import acaColorLogo from "../images/acaColorLogo.png"
import BigNumber from "bignumber.js";
import {useState, useEffect} from "react";

export const LendingPoolInfo = (props) => {
    const poolItem = props.poolItem
    const poolAddress = poolItem.poolAddr
    const tokenAddress = poolItem.tokenAddr
    const userWalletAddress = klaytn.selectedAddress
    const poolInstance = new caver.klay.Contract(AcaciaPoolAbi, poolAddress);
    const tokenInstance = new caver.klay.Contract(Kip7Abi, tokenAddress);

    const [apr, setApr] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [rewardPerSec, setRewardPerSec] = useState(0);
    const [counter, setCounter] = useState(0);

    //check APR every 5 minutes
    useEffect(() => {
        const interval = setInterval(async () => {
            await checkAPR();
            setCounter((counter + 1) % 10);
        }, 300000);
        return () => clearInterval(interval);
    }, [counter]);

    //check APR
    const checkAPR = async () => {
        await checkRewardPerSec();
        await checkTotalSupply();
        setApr(rewardPerSec * 60 * 60 * 24 * 365 * 100 / totalSupply);
    }

    const checkTotalSupply = async () => {
        const totalSupply = shiftdown(BigNumber(await poolInstance.methods.totalSupply().call()), -18);
        setTotalSupply(totalSupply)
    }

    const checkRewardPerSec = async () => {
        const rewardPerSec = shiftdown(BigNumber(await poolInstance.methods.update_RPS(userWalletAddress).call()), -18);
        setRewardPerSec(rewardPerSec)
    }

    //how to check APY?
    //how to check TVL?

    // utility function
    // shiftup << , num is BigNumber
    const shiftup = (num, n) => {
        if (n < 0) console.log("SHIFTUP WARNING");
        const result = num.multipliedBy(Math.pow(10, n));
        return BigNumber(result.toFixed(0));
    }

    // shiftdown << , num is BigNumber
    const shiftdown = (num, n) => // >> , num is BigNumber
    {
        if (n > 0) console.log("SHIFTDOWN WARNING");
        const result = num.multipliedBy(Math.pow(10, n));
        return result.toFixed(6);
    }


    return (
        <div style={{display: 'flex', 'flex-direction': 'row', 'column-gap': '30px', 'align-items': 'center'}}>
            <img src={acaColorLogo} style={{width: '40px', margin: '10px', 'margin-left': '15px'}}/>
            <div style={{display: 'flex', 'flex-direction': 'column', 'row-gap': '5px'}}>
                <span style={{"font-weight": "bold"}}>{poolItem.tokenLabel}</span>
                <div> TVL $1,000</div>
            </div>
            <div style={{display: 'flex', 'flex-direction': 'column', 'row-gap': '5px'}}>
                <span style={{"font-weight": "bold"}}>APY 300%</span>
                <div> APR {apr}%</div>
            </div>
            <div style={{display: 'flex', 'flex-direction': 'column', 'row-gap': '5px'}}>
                <div>{poolItem.term}</div>
                <div>&nbsp;</div>
            </div>
        </div>
    )
}
