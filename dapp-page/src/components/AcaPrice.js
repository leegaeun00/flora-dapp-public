import {useEffect, useState} from "react";
import BigNumber from "bignumber.js";
import AcaciaPriceAbi from '../abis/PriceAbi.json';
import { contractAddresses } from '../config/contractAddresses.js';
import {klaytn, caver} from "../caver.js";
import acaColorLogo from "../images/acaColorLogo.png";

const acaPriceAddr = contractAddresses.AcaPrice;
// const acaPriceInstance = new caver.klay.Contract(acaPriceAddr, AcaciaPriceAbi);

export const AcaPrice = () => {
    const [acaPrice, setAcaPrice] = useState(1.16);

    // useEffect(()=>{
    //     const getData = async() => {
    //         var acaPrice = await acaPriceInstance.methods.getPriceOfAca();
    //         acaPrice = shiftdown(acaPrice[0]/acaPrice[1], 12);
    //         setAcaPrice(acaPrice)
    //     }
    //     getData();
    // })

    function shiftdown(num, n) // >> , num is BigNumber
    {
        if(n > 0) console.log("SHIFTDOWN WARNING");
        var result = num.multipliedBy(Math.pow(10, n));
        return result.toFixed(6);
    }

    return(
        <div style={{display: 'flex', 'flex-direction': 'row', 'align-items':'center'}}>
            <img alt='acaColorLogo' src={acaColorLogo} style={{width:'30px', margin: '10px'}}/>
            <p style={{'font-size':'20px'}}>${acaPrice}</p>
        </div>
    )
}
