import {klaytn, caver} from "../caver.js";
import KusdtAbi from '../abis/KusdtAbi.json';
import EtfAbi from '../abis/EtfAbi.json';
import PriceAbi from '../abis/PriceAbi.json';
import acaColorLogo from "../images/acaColorLogo.png"

import BigNumber from "bignumber.js";
import {useState, useEffect} from "react";

export const EtfInfo = (props) => {
    const etfItem=props.etfItem
    const etfAddress=etfItem.etfAddr
    const tokenAddress=etfItem.tokenAddr
    const PRICE_ADDRESS=""
    const userWalletAddress = klaytn.selectedAddress
    var etfInstance = new caver.klay.Contract(EtfAbi, etfAddress);
    const tokenInstance = new caver.klay.Contract(KusdtAbi, tokenAddress);

    const [apy, setApy] = useState(0);
    const [tvl, setTvl] = useState(0);
    const [principalInKusdt, setPrincipalInKusdt] = useState(0);
    const [lpRewardsInKusdt, setLpRewardsInKusdt] = useState(0);

    useEffect(()=>{
        const getData = async() => {
            //Is this the right way to use viewPrincipal? (its not included in etf.js)
            var principalInKusdt= shiftdown(BigNumber(await etfInstance.methods.viewPrincipal(userWalletAddress).call()), -6);
            await setPrincipalInKusdt(principalInKusdt);

            var withdrawableLpsInKusdt = shiftdown(BigNumber(await etfInstance.methods.lpReward(userWalletAddress).call()),-6)
            var lpRewardsInKusdt = withdrawableLpsInKusdt - principalInKusdt
            await setLpRewardsInKusdt(lpRewardsInKusdt)

            var totalSupplyABC = await etfInstance.methods.totalSupplyOfContract().call();
            var totalSupplyA = shiftdown(BigNumber(totalSupplyABC[0]),-18)
            var totalSupplyB = shiftdown(BigNumber(totalSupplyABC[1]),-18)
            var totalSupplyC = shiftdown(BigNumber(totalSupplyABC[2]),-18)
            //need to convert these into USD value for TVL

            // async function getAPRA(){
            //     var priceInstance = new caver.klay.Contract(PriceAbi, PRICE_ADDRESS);
            //     var price = await priceInstance.methods.getPriceOfToken('0xe75a6a3a800a2c5123e67e3bde911ba761fe0705').call(); // ksp-kusdt lp token as parameter
            //     var priceKSP = shiftdown(BigNumber(price[1]), -KUSDT_DECIMAL)/shiftdown(BigNumber(price[0]), -KSP_DECIMAL);
            //     price = await PRICE_CONTRACT.methods.getPriceOfToken('').call(); // lp token
            //     var total = 2 * shiftdown(BigNumber(price[0]), -KUSDT_DECIMAL); // 0 if KUSDT is tokenA and 1 if KUSDT is tokenB
            //     var data = await fspr.readFile('./kspAPR.json', 'utf8');
            //     data = JSON.parse(data);
            //     var kspAmount = data[""];
            //     return 365 * 100 * (kspAmount * priceKSP) / total * 0.85; // 0.15 for development fee in klayswap
            // }
            //
            // async function getAPRB(){
            //     var price = await PRICE_CONTRACT.methods.getPriceOfToken('0xe75a6a3a800a2c5123e67e3bde911ba761fe0705').call(); // ksp-kusdt lp token as parameter
            //     var priceKSP = shiftdown(BigNumber(price[1]), -KUSDT_DECIMAL)/shiftdown(BigNumber(price[0]), -KSP_DECIMAL);
            //     price = await PRICE_CONTRACT.methods.getPriceOfToken('').call(); // lp token
            //     var total = 2 * shiftdown(BigNumber(price[0]), -KUSDT_DECIMAL); // 0 if KUSDT is tokenA and 1 if KUSDT is tokenB
            //     var data = await fspr.readFile('./kspAPR.json', 'utf8');
            //     data = JSON.parse(data);
            //     var kspAmount = data[""];
            //     return 365 * 100 * (kspAmount * priceKSP) / total * 0.85; // 0.15 for development fee in klayswap
            // }
            //
            // async function getAPRC(){
            //     var airdrop = shiftdown(BigNumber(await ACALP_STAKING_CONTRACT.methods.updateAcaciaRewardRatio().call()), -ACACIA_DECIMAL);
            //     var price = await PRICE_CONTRACT.methods.getPriceOfToken('').call(); // aca-kusdt lp token
            //     var priceACA = shiftdown(BigNumber(price[1]), -KUSDT_DECIMAL)/shiftdown(BigNumber(price[0]), -ACACIA_DECIMAL);
            //     return 100 * (airdrop * 365 * priceACA);
            // }
            //
            // async function getAPR(){
            //     var aprA = await getAPRA();
            //     var aprB = await getAPRB();
            //     var aprC = await getAPRC();
            //     return aprA + aprB + aprC;
            // }
            //
            // async function getAPY(){
            //     var apr = await getAPR();
            //     return (Math.pow((1+apr/36500), 365) - 1) * 100;
            // }
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
        <div style={{display: 'flex', 'flex-direction': 'row', 'column-gap':'30px', 'align-items':'center', 'height':'70px'}}>
            <img alt='acaColorLogo' src={acaColorLogo} style={{width:'40px', margin: '10px', 'margin-left': '15px'}}/>
            <div style={{display: 'flex', 'flex-direction': 'column', 'row-gap':'10px'}}>
                <div style={{display:'flex','width':'400px','flex-direction': 'row','column-gap':'5px',"font-weight":"bold",'color':'#99AE93'}}>
                    <div style={{display:'flex','width':'33%','justify-content':'center'}}>{etfItem.profitLabel[0]}</div>
                    <div style={{display:'flex','width':'33%','justify-content':'center'}}>{etfItem.profitLabel[1]}</div>
                    <div style={{display:'flex','width':'33%','justify-content':'center'}}>{etfItem.profitLabel[2]}</div>
                </div>
                <div style={{display:'flex','width':'400px','flex-direction': 'row','column-gap':'5px',"font-weight":"bold",'color':"#C9D3C5"}}>
                    <div style={{display:'flex','width':'33%','justify-content':'center','border-top':'5px solid #C9D3C5','padding-top':'3px'}}>40%</div>
                    <div style={{display:'flex','width':'33%','justify-content':'center','border-top':'5px solid #C9D3C5','padding-top':'3px'}}>40%</div>
                    <div style={{display:'flex','width':'33%','justify-content':'center','border-top':'5px solid #C9D3C5','padding-top':'3px'}}>20%</div>
                </div>
            </div>
            <div style={{display: 'flex', 'flex-direction': 'column', 'row-gap':'10px'}}>
                <span style={{"font-weight":"bold"}}>APY {Number(apy).toFixed(3)}%</span>
                <div>TVL ${Number(tvl).toFixed(3)}</div>
            </div>
            <div style={{display: 'flex', 'flex-direction': 'column', 'row-gap':'10px'}}>
                <div>deposited {Number(principalInKusdt).toFixed(3)} {etfItem.tokenLabel}</div>
                <div>earned {Number(lpRewardsInKusdt).toFixed(3)} KUSDT</div>
            </div>
        </div>
    )
}