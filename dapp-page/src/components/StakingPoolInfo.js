import {klaytn, caver} from "../caver.js";
import Kip7Abi from '../abis/Kip7Abi.json';
import AcaciaPoolAbi from '../abis/AcaciaPoolAbi.json';
import LpWithAcaPoolAbi from '../abis/LpWithAcaPoolAbi.json';
import LpWithoutAcaPoolAbi from '../abis/LpWithoutAcaPoolAbi.json';
import acaColorLogo from "../images/acaColorLogo.png"
import PunchClockIcon from '@mui/icons-material/PunchClock';

import BigNumber from "bignumber.js";
import {useState, useEffect} from "react";

export const StakingPoolInfo = (props) => {
    const poolItem=props.poolItem
    const poolAddress=poolItem.poolAddr
    const tokenAddress=poolItem.tokenAddr
    const userWalletAddress = klaytn.selectedAddress
    var poolInstance
    if (poolItem.category === "onlyAca") {
        poolInstance = new caver.klay.Contract(AcaciaPoolAbi, poolAddress);
    } else if (poolItem.category === "lpWithAca") {
        poolInstance = new caver.klay.Contract(LpWithAcaPoolAbi, poolAddress);
    } else if (poolItem.category === "lpWithoutAca") {
        poolInstance = new caver.klay.Contract(LpWithoutAcaPoolAbi, poolAddress);
    }
    const tokenInstance = new caver.klay.Contract(Kip7Abi, tokenAddress);

    const [apy, setApy] = useState(0);
    //need to know how to retrieve price of LPs to calculate TVL in USD value
    const [tvl, setTvl] = useState(0);
    const [principal, setPrincipal] = useState(0);
    const [acaRewards, setAcaRewards] = useState(0);
    const [withdrawableLp, setWithdrawableLp] = useState(0);
    const [lpRewards, setLpRewards] = useState(0);

    useEffect(()=>{
        const getData = async() => {
            var principal=0
            if (poolItem.category === "onlyAca") {
                principal = shiftdown(BigNumber(await poolInstance.methods.balanceOf(userWalletAddress).call()), -18);
            } else if (poolItem.category === "lpWithAca" || poolItem.category === "lpWithoutAca") {
                principal = shiftdown(BigNumber(await poolInstance.methods.viewPrincipal(userWalletAddress).call()), -18);
            }
            await setPrincipal(principal);

            var acaRewards=0
            var withdrawableLp=0
            if (poolItem.category === "onlyAca") {
                //withdrawable ACA?
                acaRewards = shiftdown(BigNumber(await poolInstance.methods.earned(userWalletAddress).call()), -18)
                console.log("acaRewards",acaRewards)
            } else if (poolItem.category === "lpWithAca" || poolItem.category === "lpWithoutAca") {
                withdrawableLp = shiftdown(BigNumber(await poolInstance.methods.lpReward(userWalletAddress).call()), -18)
            }
            await setAcaRewards(acaRewards);
            console.log("aca rewards",acaRewards)
            await setWithdrawableLp(withdrawableLp);

            var lpRewards = withdrawableLp - principal
            await setLpRewards(lpRewards)

            var apr;
            if (poolItem.category === "onlyAca") {
                async function updateRPS(){
                    var acaReward = shiftdown(BigNumber(await tokenInstance.methods.viewAcaReward().call()), -18);
                    return acaReward / (60*60*24);
                }
                async function totalSupply(){
                    let totalAmount = shiftdown(BigNumber(await tokenInstance.methods.totalSupply().call()), -18);
                    return totalAmount;
                }
                async function getApr(){
                    var rps = await updateRPS();
                    var totalAmount = await totalSupply();
                    return rps * 60 * 60 * 24 * 365 * 100 / totalAmount;
                }
                apr = await getApr();
                setApy((Math.pow((1+apr/36500), 365) - 1) * 100);
            }
            else if (poolItem.category === 'lpWithAca') {
                async function getRpd(){
                    var airdrop = shiftdown(BigNumber(await poolInstance.methods.airdropAmount().call()), -18);
                    var tokenContract = shiftdown(BigNumber(await poolInstance.methods.totalSupply().call()), -18);
                    var priceA = await tokenInstance.methods.getPriceOfAca().call();
                    var valueLP = 2 * shiftdown(BigNumber(priceA[1]), -18) * shiftdown(BigNumber(priceA[0]), -18) / shiftdown(BigNumber(priceA[1]), -6); // LP price by tether
                    return airdrop / (tokenContract / valueLP);
                }
                async function getApr(){
                    var rpd = await getRpd();
                    var price = await tokenInstance.methods.getPriceOfAca().call();
                    var priceACA = shiftdown(price[0], 6)/shiftdown(price[1], 18);
                    return rpd * 365 * priceACA * 100;
                }
                apr = await getApr();
                setApy((Math.pow((1+apr/36500), 365) - 1) * 100);
            }
            else if (poolItem.category === 'lpWithoutAca') {
                async function getAprAca(){
                    var airdrop = shiftdown(BigNumber(await poolInstance.methods.airdropAmount().call()), -18);
                    var price = await tokenInstance.methods.getPriceOfAca().call();
                    var priceACA = shiftdown(BigNumber(price[0]), 6)/shiftdown(BigNumber(price[1]), 18);
                    var lpNum = shiftdown(BigNumber(await poolInstance.methods.kslpSupply().call()), -18);
                    var priceLP = 2 * shiftdown(BigNumber(price[1]), -18) * shiftdown(BigNumber(price[0]), -18) / (lpNum * shiftdown(BigNumber(price[1]), -6)); // LP price by tether
                    var totalSupply = shiftdown(BigNumber(await poolInstance.methods.totalSupply().call()), -18);
                    var total = await totalSupply * priceLP;
                    return 100 * (airdrop * 365 * priceACA) / total;
                }

                async function getAprKsp(){
                    var price = await tokenInstance.methods.getPriceOfToken('0xe75a6a3a800a2c5123e67e3bde911ba761fe0705').call();
                    var priceKSP = shiftdown(BigNumber(price[1]), -6)/shiftdown(BigNumber(price[0]), -18);
                    price = await tokenInstance.methods.getPriceOfToken('0xc320066b25b731a11767834839fe57f9b2186f84').call();
                    var total = 2 * shiftdown(BigNumber(price[0]), -6);
                    // need to retrieve blockchain data
                    // var data = await fs.readFile('./kspAPR.json', 'utf8');
                    // data = JSON.parse(data);
                    // var kspAmount = data["kusdt+kdai"];
                    var kspAmount = 1427;
                    return 365 * 100 * (kspAmount * priceKSP) / total * 0.85; // 0.15 for development fee in klayswap
                }

                async function getAPR(){
                    var acaAPR = await getAprAca();
                    var kspAPR = await getAprKsp();
                    return acaAPR + kspAPR;
                }
                apr = await getAPR();
                setApy((Math.pow((1+apr/36500), 365) - 1) * 100);
            }
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
                <span style={{"font-weight":"bold"}}>{poolItem.tokenLabel}</span>
                <div style={{display: 'flex','align-items':'center'}}>
                    {poolItem.lockup !== '0 days' ? <PunchClockIcon style={{'width': '18px','margin-right': '3px'}}/> : <PunchClockIcon style={{'width': '18px','margin-right': '3px', 'color':'lightgrey'}}/>}
                    {poolItem.lockup}
                </div>
            </div>
            <div style={{display: 'flex', 'flex-direction': 'column', 'row-gap':'10px'}}>
                <span style={{"font-weight":"bold"}}>APY {Number(apy).toFixed(3)}%</span>
                <div>TVL ${Number(tvl).toFixed(3)}</div>
            </div>
            {poolItem.category === 'onlyAca' ?
                <div style={{display: 'flex', 'flex-direction': 'column', 'row-gap':'10px'}}>
                    <div>deposited {Number(principal).toFixed(3)} {poolItem.tokenLabel}</div>
                    <div>earned {Number(acaRewards).toFixed(3)} ACA </div>
                </div> : ''}
            {(poolItem.category === 'lpWithAca'||poolItem.category === 'lpWithoutAca') ?
                <div style={{display: 'flex', 'flex-direction': 'column', 'row-gap':'10px'}}>
                    <div>deposited {Number(principal).toFixed(3)} {poolItem.tokenLabel}</div>
                    <div>earned {Number(lpRewards).toFixed(3)} {poolItem.profitLabel} </div>
                </div> : ''}
        </div>
    )
}