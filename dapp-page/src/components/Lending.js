import {LendingCard} from "./LendingCard.js";
import {getPoolList} from "../config/lendingPoolConfig.js";
import {useState} from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const Lending = () => {
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
            <h1>Lending</h1>
            {poolList.map(poolItem =>
                <LendingCard poolItem={poolItem} expanded={expandedCardPoolId === poolItem.id}
                             onChange={handleCardExpansion(poolItem.id)} expandIcon={expandIcon}/>
            )}
        </div>
    )
}