import TextField from "@mui/material/TextField";
import {useState, useEffect} from "react";
import { styled } from '@mui/material/styles';
import BigNumber from "bignumber.js";

//may need to customize ABI for other pool and tokens
//Is KUSDT ABI the same as KIP7 ABI?
import KusdtAbi from '../abis/KusdtAbi.json';
import EtfAbi from '../abis/EtfAbi.json';
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

export const EtfDepositOrWithdraw = (props) => {
    const [depositOrWithdraw, setDepositOrWithdraw] = useState('Deposit');
    const [isApproved, setIsApproved] = useState(false);
    const [tokenAmount, setTokenAmount] = useState();
    const [walletBalance, setWalletBalance] = useState(0);
    const [withdrawableLpA, setWithdrawableLpA] = useState(0);
    const [withdrawableLpB, setWithdrawableLpB] = useState(0);
    const [withdrawableLpC, setWithdrawableLpC] = useState(0);
    const [floraBalance, setFloraBalance] = useState(0);

    const etfItem=props.etfItem;
    const etfAddress=etfItem.etfAddr;
    const tokenAddress=etfItem.tokenAddr;
    const userWalletAddress = klaytn.selectedAddress
    const etfInstance = new caver.klay.Contract(EtfAbi, etfAddress);
    // input token is always KUSDT for ETF
    const tokenInstance = new caver.klay.Contract(KusdtAbi, tokenAddress);

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
                <div style={{'margin-top': '15px'}}>Wallet Balance: {Number(walletBalance).toFixed(3)} {etfItem.tokenLabel}</div>
                <NumberInput variant="outlined" value={tokenAmount} onChange={(e)=>setTokenAmount(e.target.value)}
                             InputProps={{ endAdornment: (<InputAdornment position="end">{etfItem.tokenLabel}</InputAdornment>)}}/>
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
                <div style={{'margin-top': '15px'}}>Withdrawable Balance: {Number(withdrawableLpA).toFixed(3)} {etfItem.profitLabel[0]}</div>
                <div style={{'margin-top': '5px', 'margin-left':'175px'}}>{Number(withdrawableLpB).toFixed(3)} {etfItem.profitLabel[1]}</div>
                <div style={{'margin-top': '5px', 'margin-left':'175px'}}>{Number(withdrawableLpC).toFixed(3)} {etfItem.profitLabel[2]}</div>
                <div style={{'margin-top': '5px'}}>Flora LP Balance: {Number(floraBalance).toFixed(3)} Flora LP</div>
                <NumberInput variant="outlined" value={tokenAmount} onChange={(e)=>setTokenAmount(e.target.value)}
                             InputProps={{ endAdornment: (<InputAdornment position="end">Flora LP</InputAdornment>)}}/>
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
            //decimal is 6 because KUSDT is used for ETF
            //Should it be shift up and 6 or shiftdown and -6??
            const walletBalance = shiftdown(BigNumber(await tokenInstance.methods.balanceOf(userWalletAddress).call()), -6);
            setWalletBalance(walletBalance);

            var withdrawableLpABC = await etfInstance.methods.getUserAmount(userWalletAddress).call()
            var withdrawableLpA = await shiftdown(BigNumber(withdrawableLpABC[0],-18))
            var withdrawableLpB = await shiftdown(BigNumber(withdrawableLpABC[1],-18))
            var withdrawableLpC = await shiftdown(BigNumber(withdrawableLpABC[2],-18))
            await setWithdrawableLpA(withdrawableLpA);
            await setWithdrawableLpB(withdrawableLpB);
            await setWithdrawableLpC(withdrawableLpC);

            var floraBalance= shiftdown(BigNumber(await etfInstance.methods.balanceOfUser(userWalletAddress).call()), -18);
            await setFloraBalance(floraBalance);

            var isApproved=false
            var currentAllowance = await tokenInstance.methods.allowance(userWalletAddress, etfAddress).call();
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
        //decimal is 6 because KUSDT is used for ETF
        const tokenAmountBigNumber = shiftup(BigNumber(tokenAmount), 6);
        await etfInstance.methods.deposit(tokenAmountBigNumber).send({from: userWalletAddress, gas: 1000000}, function(error, transactionHash){
            if(error) return error;
            return transactionHash;
        });
    }

    //withdraw
    const withdraw = async() => {
        if (isApproved === false){
            await approve();
        }
        if (floraBalance < tokenAmount){
            return -1;
        }
        const tokenAmountBigNumber = shiftup(BigNumber(tokenAmount), 6);
        await etfInstance.methods.withdraw(tokenAmountBigNumber).send({from: userWalletAddress, gas: 1000000}, function(error, transactionHash){
            if(error) return error;
            return transactionHash;
        });
    }

    // approve
    const approve = async() => {
        const largestAllowance = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        await tokenInstance.methods.approve(etfAddress, largestAllowance).send({
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