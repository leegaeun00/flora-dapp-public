import {StakingCard} from "./StakingCard.js";
import {getPoolList} from "../config/stakingPoolConfig.js";
import {useState} from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const Staking = () => {
    const [expandedCardPoolId, setExpandedCardPoolId] = useState('')
    const [expandIcon, setExpandIcon] = useState(<ExpandMoreIcon/>)

    const poolList=getPoolList();

    const handleCardExpansion = (poolId) => (e, isExpanded) => {
        console.log({e, isExpanded, expandedCardPoolId});
        setExpandedCardPoolId(isExpanded ? poolId : '');
        setExpandIcon(<ExpandLessIcon/>)
    };

    return(
        <div>
            <h1>Staking</h1>
            {poolList.map(poolItem =>
                <StakingCard poolItem={poolItem} expanded={expandedCardPoolId === poolItem.id}
                             onChange={handleCardExpansion(poolItem.id)} expandIcon={expandIcon}/>
            )}
        </div>
    )
}