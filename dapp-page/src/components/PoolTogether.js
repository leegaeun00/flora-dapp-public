import {PoolTogetherCard} from "./PoolTogetherCard.js";
import {getPoolList} from "../config/stakingPoolConfig.js";
import {useState, useEffect} from "react";
import BigNumber from "bignumber.js";
import {caver} from "../caver";
import AcaciaPoolAbi from "../abis/AcaciaPoolAbi.json";

export const PoolTogether = () => {
    //need to change to get pool together list
    const poolList=getPoolList();
    const [roundTime, setRoundTime] = useState(0);

    //use any pool instance? need to insert pool address
    const poolInstance = new caver.klay.Contract(AcaciaPoolAbi, "");

    //need to receive as days, hours, minutes, and seconds
    useEffect(()=>{
        const getData = async() => {
            //may have to modify calling the below functions
            var roundTime = shiftdown(BigNumber(await poolInstance.methods.leftTime().call()), -18);
            setRoundTime(roundTime);
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

    //add deposit and withdraw after expansion?

    return(
        <div>
            <h1>Pool Together</h1>
            <div>Time left for this round: {roundTime} days {roundTime} hours {roundTime} minutes {roundTime} seconds </div>
            <div style={{display: 'flex', 'flex-direction': 'row', 'flex-wrap':'wrap'}}>
                {poolList.map(poolItem =>
                    <PoolTogetherCard poolItem={poolItem}/>
                )}
            </div>
        </div>
    )
}