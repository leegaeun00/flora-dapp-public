import TextField from "@mui/material/TextField";
import {useState, useEffect} from "react";
import { styled } from '@mui/material/styles';
import BigNumber from "bignumber.js";

//may need to customize ABI for other pool and tokens
import Kip7Abi from '../abis/Kip7Abi.json';
import AcaciaPoolAbi from '../abis/AcaciaPoolAbi.json';
import {klaytn, caver} from "../caver.js";

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
    'width': '265px'
})

export const PoolTogetherDepositOrWithdraw = (props) => {
    const [depositOrWithdraw, setDepositOrWithdraw] = useState('Deposit');
    const [isApproved, setIsApproved] = useState(true);
    const [tokenAmount, setTokenAmount] = useState();
    const [poolBalance, setPoolBalance] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);

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
            return <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content':'center'}}>{DepositBox()}</div>;
        } else if (depositOrWithdraw === 'Withdraw') {
            return <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content':'center'}}>{WithdrawBox()}</div>;
        }
    }

    //DepositBox
    function DepositBox() {
        return (
            <div>
                <div style={{'margin-top': '15px'}}>Wallet Balance: {walletBalance} {poolItem.tokenLabel}</div>
                <NumberInput variant="outlined" value={tokenAmount} placeholder="0" onChange={(e)=>setTokenAmount(e.target.value)}/>
                {isApproved ? <DepositButton/> : <ApproveButton/>}
            </div>
        )
    }

    //WithdrawBox
    function WithdrawBox() {
        return (
            <div>
                <div style={{'margin-top': '15px'}}>Pool Balance: {poolBalance} {poolItem.tokenLabel}</div>
                <NumberInput variant="outlined" value={tokenAmount} placeholder="0" onChange ={(e)=>changeTokenAmount(e.target.value)}/>
                {isApproved ? <WithdrawButton/> : <ApproveButton/>}
            </div>
        )
    }

    useEffect(()=>{
        const getData = async() => {
            const poolBalance = shiftdown(BigNumber(await poolInstance.methods.balanceOf(userWalletAddress).call()), -18);
            setPoolBalance(poolBalance);
            const walletBalance = shiftdown(BigNumber(await tokenInstance.methods.balanceOf(userWalletAddress).call()), -18);
            setWalletBalance(walletBalance);
        }
        getData();
    })


    const changeTokenAmount = async(newTokenAmount) => {
        await setTokenAmount(newTokenAmount);
    }

    //DepositButton
    function DepositButton() {
        return (
            <div className="threeDButton" onClick={deposit} style={{'margin-top': '20px'}}>
                Deposit
            </div>
        )
    }

    //DepositButton
    function WithdrawButton() {
        return (
            <div className="threeDButton" onClick={withdraw} style={{'margin-top': '20px'}}>
                Withdraw
            </div>
        )
    }

    //ApproveButton
    function ApproveButton() {
        return (
            <div className="threeDButton" onClick={approve} style={{'margin-top': '20px'}}>
                Approve
            </div>
        )
    }

    //deposit
    const deposit = async() => {
        const tokenAmountBigNumber = shiftup(BigNumber(tokenAmount), 18);
        await poolInstance.methods.deposit(tokenAmountBigNumber).send({from: userWalletAddress, gas: 1000000}, function(error, transactionHash){
            if(error) return error;
            return transactionHash;
        });
    }

    //withdraw
    const withdraw = async() => {
        if (await poolBalance() < tokenAmount){
        }
        const tokenAmountBigNumber = shiftup(BigNumber(tokenAmount), 18);
        await poolInstance.methods.withdraw(tokenAmountBigNumber).send({from: userWalletAddress, gas: 1000000}, function(error, transactionHash){
            if(error) return error;
            return transactionHash;
        });
    }

    //approve
    const approve = async() => {
        const currentAllowance = await tokenInstance.methods.allowance(userWalletAddress, poolAddress).call();
        console.log("currentAllowance", currentAllowance, typeof(currentAllowance));
        if (currentAllowance < "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff") {
            const largestAllowance = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
            await tokenInstance.methods.approve(poolAddress, largestAllowance).send({
                from: userWalletAddress,
                gas: 1000000
            });
            setIsApproved(true);
        }
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
        <div style={{display: 'flex', 'flex-direction': 'column','width':'350px','justify-content':'center'}}>
            <DepositOrWithdrawSelectBox/>
            <div>{DepositOrWithdrawInputBox()}</div>;
        </div>
    )
}