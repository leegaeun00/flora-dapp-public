import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import '../styles/style.css';

import {LendingPoolInfo} from "./LendingPoolInfo.js";
import {LendingDepositOrWithdraw} from "./LendingDepositOrWithdraw.js";
import {LendingRepay} from "./LendingRepay.js";

export const LendingCard = (props) => {
    const poolItem=props.poolItem
    const expanded=props.expanded
    const onChange=props.onChange
    const expandIcon=props.expandIcon

    return(
        <div className="StakingCard">
            <Accordion className="Accordion" expanded={expanded}
                       onChange={onChange}>
                <AccordionSummary expandIcon={expandIcon}>
                    <LendingPoolInfo poolItem={poolItem}/>
                </AccordionSummary>
                <AccordionDetails className="AccordianDetails" style={{
                    'display': 'flex', 'flex-direction': 'row', 'justify-content': 'center', 'height': '250px'}}>
                    <LendingDepositOrWithdraw style={{'margin-bottom': '20px'}} poolItem={poolItem}/>
                    <LendingRepay poolItem={poolItem}/>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}