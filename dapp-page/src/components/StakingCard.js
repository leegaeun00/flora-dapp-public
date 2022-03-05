import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import '../styles/style.css';

import {StakingPoolInfo} from "./StakingPoolInfo.js";
import {StakingDepositOrWithdraw} from "./StakingDepositOrWithdraw.js";
import {StakingClaim} from "./StakingClaim.js";

export const StakingCard = (props) => {
    const poolItem=props.poolItem
    const expanded=props.expanded
    const onChange=props.onChange
    const expandIcon=props.expandIcon

    return(
        <div className="StakingCard">
            <Accordion className="Accordion" expanded={expanded}
            onChange={onChange}>
                <AccordionSummary expandIcon={expandIcon}>
                    <StakingPoolInfo poolItem={poolItem}/>
                </AccordionSummary>
                <AccordionDetails className="AccordianDetails" style={{
                    'display': 'flex', 'flex-direction': 'row', 'justify-content': 'center', 'height': '250px'}}>
                    <StakingDepositOrWithdraw style={{'margin-bottom': '20px'}} poolItem={poolItem}/>
                    <StakingClaim poolItem={poolItem}/>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}