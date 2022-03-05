import {useEffect, useState} from "react";
import BigNumber from "bignumber.js";
import AcaciaPriceAbi from '../abis/AcaciaPriceAbi.json';
import { contractAddresses } from '../config/contractAddresses.js';
import {klaytn, caver} from "../caver.js";

const acaPriceAddr = contractAddresses.AcaPrice;
const acaPriceInstance = new caver.klay.Contract(acaPriceAddr, AcaciaPriceAbi);

export const AcaPrice = () => {
    const [acaPrice, setAcaPrice] = useState(0);

    useEffect(()=>{
        const getData = async() => {
            var acaPrice = await acaPriceInstance.methods.getPriceOfAca();
            acaPrice = shiftdown(acaPrice[0]/acaPrice[1], 12);
            setAcaPrice(acaPrice)
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
}
