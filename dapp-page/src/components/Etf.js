import {EtfCard} from "./EtfCard.js";
import {getEtfList} from "../config/etfConfig.js";
import {useState} from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const Etf = () => {
    const [expandedCardEtfId, setExpandedCardEtfId] = useState('')
    const [expandIcon, setExpandIcon] = useState(<ExpandMoreIcon/>)

    const etfList=getEtfList();

    const handleCardExpansion = (etfId) => (e, isExpanded) => {
        console.log({e, isExpanded, expandedCardEtfId});
        setExpandedCardEtfId(isExpanded ? etfId : '');
        setExpandIcon(<ExpandLessIcon/>)
    };

    return(
        <div>
            <h1>ETF</h1>
            {etfList.map(etfItem =>
                <EtfCard etfItem={etfItem} expanded={expandedCardEtfId === etfItem.id}
                             onChange={handleCardExpansion(etfItem.id)} expandIcon={expandIcon}/>
            )}
        </div>
    )
}