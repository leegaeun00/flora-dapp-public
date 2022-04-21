import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import '../styles/style.css';

import {StakingPoolInfo} from "./StakingPoolInfo.js";
import {StakingDepositOrWithdraw} from "./StakingDepositOrWithdraw.js";
import {StakingClaimAca} from "./StakingClaimAca.js";

export const StakingCard = (props) => {
    const poolItem=props.poolItem
    const expanded=props.expanded
    const onChange=props.onChange
    const expandIcon=props.expandIcon

    return(
        <div className="StakingCard" style={{display: 'flex', 'flex-direction': 'column', 'margin-left': '25%'}}>
            <Accordion className="Accordion" expanded={expanded}
            onChange={onChange}>
                <AccordionSummary expandIcon={expandIcon}>
                    <StakingPoolInfo poolItem={poolItem}/>
                </AccordionSummary>
                <AccordionDetails className="AccordianDetails" style={{
                    'display': 'flex', 'flex-direction': 'row', 'justify-content': 'center', 'height': '350px'}}>
                    <StakingDepositOrWithdraw style={{'margin-bottom': '20px'}} poolItem={poolItem}/>
                    {poolItem.category === 'lpWithAca' ?
                        <div></div> : <StakingClaimAca poolItem={poolItem}/>
                    }
                </AccordionDetails>
            </Accordion>
            {poolItem.lockup === '90 days' ?
                <div style={{'margin-bottom': '30px'}}></div> : <div></div>
            }
            {poolItem.lockup === '0 days' ?
                <div style={{'margin-bottom': '30px'}}></div> : <div></div>
            }
        </div>
    )
}