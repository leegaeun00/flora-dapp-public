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
    'margin-right': '20px',
    'width': '265px'
})

export const StakingDepositOrWithdraw = (props) => {
    const [depositOrWithdraw, setDepositOrWithdraw] = useState('Deposit');
    const [isApproved, setIsApproved] = useState(true);
    const [tokenAmount, setTokenAmount] = useState();
    const [canWithdraw, setCanWithdraw] = useState(false);
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
            return <div>{DepositBox()}</div>;
        } else if (depositOrWithdraw === 'Withdraw') {
            return <div>{WithdrawBox()}</div>;
        }
    }

    //DepositBox
    function DepositBox() {
        if (isApproved) {
            return (
                <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content':'center'}}>
                    <div style={{'margin-top': '15px'}}>Wallet Balance: {walletBalance} {poolItem.tokenLabel}</div>
                    <NumberInput variant="outlined" value={tokenAmount} placeholder="0" onChange={(e)=>setTokenAmount(e.target.value)}/>
                    <DepositButton/>
                </div>
            )
        }
        else {
            return (
                <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center'}}>
                    <div style={{'margin-top': '15px'}}>Wallet Balance: {walletBalance} {poolItem.tokenLabel}</div>
                    <NumberInput disabled variant="outlined" placeholder="0 (Click Approve first)"/>
                    <ApproveButton/>
                </div>
            )
        }
    }

    //WithdrawBox
    function WithdrawBox() {
        if (isApproved) {
            return (
                <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center'}}>
                    <div style={{'margin-top': '15px'}}>Pool Balance: {poolBalance} {poolItem.tokenLabel}</div>
                    <NumberInput variant="outlined" value={tokenAmount} placeholder="0" onChange ={(e)=>changeTokenAmount(e.target.value)}/>
                    <WithdrawButton/>
                </div>
            )
        }
        else {
            return (
                <div style={{'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center'}}>
                    <div style={{'margin-top': '15px'}}>Pool Balance: {poolBalance} {poolItem.tokenLabel}</div>
                    <NumberInput disabled variant="outlined" placeholder="0 (Click Approve first)"/>
                    <ApproveButton/>
                </div>
            )
        }
    }

    useEffect(()=>{
        const getData = async() => {
            const canWithdraw = await poolInstance.methods.canWithdraw(userWalletAddress).call();
            setCanWithdraw(canWithdraw);
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
            <div className="threeDButton" onClick={deposit} style={{'margin-top': '20px', 'margin-left': '75px'}}>
                Deposit
            </div>
        )
    }

    //DepositButton
    function WithdrawButton() {
        return (
            <div className="threeDButton" onClick={withdraw} style={{'margin-top': '20px', 'margin-left': '75px'}}>
                Withdraw
            </div>
        )
    }

    //ApproveButton
    function ApproveButton() {
        return (
            <div className="threeDButton" onClick={approve} style={{'margin-top': '20px', 'margin-left': '75px'}}>
                Approve
            </div>
        )
    }

    //deposit
    const deposit = async() => {
        const tokenAmountBigNumber = shiftup(BigNumber(tokenAmount), 18);
        await poolInstance.methods._stake(tokenAmountBigNumber).send({from: userWalletAddress, gas: 1000000}, function(error, transactionHash){
            if(error) return error;
            return transactionHash;
        });
    }

    //withdraw
    const withdraw = async() => {
        if (await canWithdraw()==false || await poolBalance() < tokenAmount){

        }
        const tokenAmountBigNumber = shiftup(BigNumber(tokenAmount), 18);
        await poolInstance.methods._stake(tokenAmountBigNumber).send({from: userWalletAddress, gas: 1000000}, function(error, transactionHash){
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
        <div style={{display: 'flex', 'flex-direction': 'column','margin-left':'10px'}}>
            <DepositOrWithdrawSelectBox/>
            <div>{DepositOrWithdrawInputBox()}</div>;
        </div>
    )
}