import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import '../styles/style.css';

import {EtfInfo} from "./EtfInfo.js";
import {EtfDepositOrWithdraw} from "./EtfDepositOrWithdraw.js";

export const EtfCard = (props) => {
    const etfItem=props.etfItem
    const expanded=props.expanded
    const onChange=props.onChange
    const expandIcon=props.expandIcon

    return(
        <div className="EtfCard" style={{'display': 'flex', 'flex-direction': 'column', 'margin-left': '25%'}}>
            <Accordion className="Accordion" expanded={expanded}
                       onChange={onChange}>
                <AccordionSummary expandIcon={expandIcon}>
                    <EtfInfo etfItem={etfItem}/>
                </AccordionSummary>
                <AccordionDetails className="AccordianDetails" style={{
                    'display': 'flex', 'flex-direction': 'row', 'justify-content': 'center', 'height': '400px'}}>
                    <EtfDepositOrWithdraw style={{'margin-bottom': '20px'}} etfItem={etfItem}/>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}