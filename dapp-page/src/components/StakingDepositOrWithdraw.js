import TextField from "@mui/material/TextField";
import {useState, useEffect} from "react";
import { styled } from '@mui/material/styles';
import BigNumber from "bignumber.js";

//may need to customize ABI for other pool and tokens
import Kip7Abi from '../abis/Kip7Abi.json';
import AcaciaPoolAbi from '../abis/AcaciaPoolAbi.json';
import {klaytn, caver} from "../caver.js";
import InputAdornment from "@mui/material/InputAdornment";

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
    'width': '380px'
})

export const StakingDepositOrWithdraw = (props) => {
    const [depositOrWithdraw, setDepositOrWithdraw] = useState('Deposit');
    const [isApproved, setIsApproved] = useState(false);
    const [tokenAmount, setTokenAmount] = useState();
    const [canWithdraw, setCanWithdraw] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [withdrawableLp, setWithdrawableLp] = useState(0);
    const [floraBalance, setFloraBalance] = useState(0);

    const poolItem=props.poolItem;
    const poolAddress=poolItem.poolAddr;
    const tokenAddress=poolItem.tokenAddr;
    const userWalletAddress = klaytn.selectedAddress
    // const caver = new Caver('https://kaikas.cypress.klaytn.net:8651');
    const poolInstance = new caver.klay.Contract(AcaciaPoolAbi, poolAddress);
    const tokenInstance = new caver.klay.Contract(Kip7Abi, tokenAddress);

    //DepositOrWithdrawSelectBox
    function DepositOrWithdrawSelectBox() {
        return (
            <div style={{display: 'flex', 'flex-direction': 'row', 'column-gap':'30px', 'justify-content':'center'}}>
                <h4 className={depositOrWithdraw==="Deposit" ? "ButtonDepositSelected" : "ButtonDepositNotSelected"}
                    onClick={()=>setDepositOrWithdraw("Deposit")}>
                    Deposit
                </h4>
                <h4 className={depositOrWithdraw==="Withdraw" ? "ButtonWithdrawSelected" : "ButtonWithdrawNotSelected"}
                    onClick={()=>setDepositOrWithdraw("Withdraw")}>
                    Withdraw
                </h4>
            </div>
        )
    }

    //DepositOrWithdrawInputBox
    function DepositOrWithdrawInputBox() {
        if (depositOrWithdraw === 'Deposit') {
            return <div>{DepositBox()}</div>;
        } else if (depositOrWithdraw === 'Withdraw') {
            return <div>{WithdrawBox()}</div>;
        }
    }

    //DepositBox
    function DepositBox() {
        return (
            <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content':'center'}}>
                <div style={{'margin-top': '15px'}}>Wallet Balance: {Number(walletBalance).toFixed(3)} {poolItem.tokenLabel}</div>
                <NumberInput variant="outlined" value={tokenAmount} onChange={(e)=>setTokenAmount(e.target.value)}
                             InputProps={{ endAdornment: (<InputAdornment position="end">{poolItem.tokenLabel}</InputAdornment>)}}/>
                <div style={{'display':'flex', 'flex-direction':'row', 'justify-content':'center', 'column-gap':'10px', 'margin-left':'10px', 'font-size':'15px'}}>
                    <div className="threeDButtonDarker" onClick={()=> {setTokenAmount(walletBalance*0.25)}}
                         style={{'margin-top': '8px','justify-content':'center','align-items':'center','height':'20px','width':'20px'}}>
                        25%
                    </div>
                    <div className="threeDButtonDarker" onClick={()=> {setTokenAmount(walletBalance*0.5)}}
                         style={{'margin-top': '8px','justify-content':'center','align-items':'center','height':'20px','width':'20px'}}>
                        50%
                    </div>
                    <div className="threeDButtonDarker" onClick={()=> {setTokenAmount(walletBalance*0.75)}}
                         style={{'margin-top': '8px', 'justify-content':'center','align-items':'center','height':'20px','width':'20px'}}>
                        75%
                    </div>
                    <div className="threeDButtonDarker" onClick={()=> {setTokenAmount(walletBalance)}}
                         style={{'margin-top': '8px', 'justify-content':'center','align-items':'center','height':'20px','width':'20px', "padding": "10px 20px 10px 10px"}}>
                        MAX
                    </div>
                </div>
                {isApproved ? <DepositButton/> : <ApproveButton/>}
            </div>
        )
    }

    //WithdrawBox
    function WithdrawBox() {
        return (
            <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content':'center'}}>
                <div style={{'margin-top': '15px'}}>Withdrawable Balance: {Number(withdrawableLp).toFixed(3)} {poolItem.profitLabel}</div>
                {poolItem.category!=="onlyAca" ? <div style={{'margin-top': '5px'}}>Flora LP Balance: {Number(floraBalance).toFixed(3)} Flora {poolItem.tokenLabel} LP</div> : <div></div>}
                {poolItem.category!=="onlyAca" ?
                    <NumberInput variant="outlined" value={tokenAmount} onChange={(e)=>setTokenAmount(e.target.value)}
                             InputProps={{ endAdornment: (<InputAdornment position="end">Flora LP</InputAdornment>)}}/>
                    :
                    <NumberInput variant="outlined" value={tokenAmount} onChange={(e)=>setTokenAmount(e.target.value)}
                             InputProps={{ endAdornment: (<InputAdornment position="end">ACA</InputAdornment>)}}/>
                }
                <div style={{'display':'flex', 'flex-direction':'row', 'justify-content':'center','column-gap':'10px', 'margin-left':'10px', 'font-size':'15px'}}>
                    <div className="threeDButtonDarker" onClick={()=> {setTokenAmount(floraBalance*0.25)}}
                         style={{'margin-top': '8px','justify-content':'center','align-items':'center','height':'20px','width':'20px'}}>
                        25%
                    </div>
                    <div className="threeDButtonDarker" onClick={()=> {setTokenAmount(floraBalance*0.5)}}
                         style={{'margin-top': '8px','justify-content':'center','align-items':'center','height':'20px','width':'20px'}}>
                        50%
                    </div>
                    <div className="threeDButtonDarker" onClick={()=> {setTokenAmount(floraBalance*0.75)}}
                         style={{'margin-top': '8px', 'justify-content':'center','align-items':'center','height':'20px','width':'20px'}}>
                        75%
                    </div>
                    <div className="threeDButtonDarker" onClick={()=> {setTokenAmount(floraBalance)}}
                         style={{'margin-top': '8px', 'justify-content':'center','align-items':'center','height':'20px','width':'20px', "padding": "10px 20px 10px 10px"}}>
                        MAX
                    </div>
                </div>
                {isApproved ? <WithdrawButton/> : <ApproveButton/>}
            </div>
        )
    }

    useEffect(()=>{
        const getData = async() => {
            const walletBalance = shiftdown(BigNumber(await tokenInstance.methods.balanceOf(userWalletAddress).call()), -18);
            setWalletBalance(walletBalance);

            var canWithdraw = await poolInstance.methods.canWithdraw(userWalletAddress).call();
            setCanWithdraw(canWithdraw);

            var withdrawableLp=0
            if (poolItem.category === "lpWithAca" || poolItem.category === "lpWithoutAca") {
                withdrawableLp = shiftdown(BigNumber(await poolInstance.methods.lpReward(userWalletAddress).call()), -18)
            }
            await setWithdrawableLp(withdrawableLp);

            var floraBalance=0
            if (poolItem.category === "lpWithAca" || poolItem.category === "lpWithoutAca") {
                floraBalance = shiftdown(BigNumber(await poolInstance.methods.balanceOfUser(userWalletAddress).call()), -18)
            }
            await setFloraBalance(floraBalance);

            var isApproved=false
            var currentAllowance = await tokenInstance.methods.allowance(userWalletAddress, poolAddress).call();
            // console.log("currentAllowance", currentAllowance, typeof(currentAllowance));
            if (currentAllowance < "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff") {
                isApproved=false
            } else {
                isApproved=true
            }
            await setIsApproved(isApproved)

        }
        getData();
    })

    //DepositButton
    function DepositButton() {
        return (
            <div className="threeDButton" onClick={deposit} style={{'margin-top': '20px', 'margin-left': '135px'}}>
                Deposit
            </div>
        )
    }

    //DepositButton
    function WithdrawButton() {
        return (
            <div className="threeDButton" onClick={withdraw} style={{'margin-top': '20px', 'margin-left': '135px'}}>
                Withdraw
            </div>
        )
    }

    // ApproveButton -> combine approve with deposit and withdraw buttons
    function ApproveButton() {
        return (
            <div className="threeDButton" onClick={approve} style={{'margin-top': '20px', 'margin-left': '135px'}}>
                Approve
            </div>
        )
    }

    //deposit
    const deposit = async() => {
        if (isApproved === false){
            await approve();
        }
        const tokenAmountBigNumber = shiftup(BigNumber(tokenAmount), 18);
        await poolInstance.methods._stake(tokenAmountBigNumber).send({from: userWalletAddress, gas: 1000000}, function(error, transactionHash){
            if(error) return error;
            return transactionHash;
        });
    }

    //withdraw
    const withdraw = async() => {
        if (isApproved === false){
            await approve();
        }
        if (await canWithdraw() === false || floraBalance < tokenAmount){
            return -1;
        }
        const tokenAmountBigNumber = shiftup(BigNumber(tokenAmount), 18);
        await poolInstance.methods._stake(tokenAmountBigNumber).send({from: userWalletAddress, gas: 1000000}, function(error, transactionHash){
            if(error) return error;
            return transactionHash;
        });
    }

    // approve
    const approve = async() => {
        const largestAllowance = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        await tokenInstance.methods.approve(poolAddress, largestAllowance).send({
            from: userWalletAddress,
            gas: 1000000
        });
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
        <div style={{display: 'flex', 'flex-direction': 'column','margin-left':'10px'}}>
            <DepositOrWithdrawSelectBox/>
            <div>{DepositOrWithdrawInputBox()}</div>;
        </div>
    )
}