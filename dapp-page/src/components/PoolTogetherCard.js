import Card from "@mui/material/Card";
import {PoolTogetherDepositOrWithdraw} from "./PoolTogetherDepositOrWithdraw";
import {PoolTogetherPoolInfo} from "./PoolTogetherPoolInfo";

export const PoolTogetherCard = (props) => {
    const poolItem=props.poolItem
    return(
        <div className="PoolTogetherCard" style={{display: 'flex','flex-direction':'column','flex-basis':'33.333333%'}}>
            <Card>
                <PoolTogetherPoolInfo poolItem={poolItem}></PoolTogetherPoolInfo>
                <PoolTogetherDepositOrWithdraw style={{'margin-bottom': '20px'}} poolItem={poolItem}/>
            </Card>
        </div>
    )
}