import {useEffect, useState} from "react";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LockClockIcon from '@mui/icons-material/LockClock';
import acaColorLogo from "../images/acaColorLogo.png";

export const IdoCountDownTimer = () => {
    //timeStatus: "untilIdoStart", "untilIdoEnd", "untilVestingStart", "untilVestingEnd", "vestingEnd"
    const [timeStatus, setTimeStatus] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);

    const calculateTimeLeft = () => {
        //20:00 KST is equivalent to 12:00 UTC during daylight saving
        //month:3 is equivalent to April, hours:11 is equivalent to 12:00pm noon
        const idoStart = new Date(Date.UTC(2022,3,22,11,0))
        const idoEnd = new Date(Date.UTC(2022,3,29,11,0))
        const vestingStart = new Date(Date.UTC(2022,4,13,11,0))
        //vesting ends after 40 days of start of vesting
        const vestingEnd = new Date(Date.UTC(2022,5,22,11,0))
        const date = new Date();
        const current = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
        // console.log(current, idoStart)

        let difference;
        if (idoStart-current >=0) {
            difference = idoStart - current;
            setTimeStatus("untilIdoStart")

        } else if (idoEnd-current >=0){
            difference = idoEnd - current;
            setTimeStatus("untilIdoEnd")

        } else if (vestingStart-current >=0){
            difference = vestingStart - current;
            setTimeStatus("untilVestingStart")

        } else if (vestingEnd >=0){
            difference = vestingEnd - current;
            setTimeStatus("untilVestingEnd")

        } else {
            difference = 0;
            setTimeStatus("vestingEnd")
        }

        let timeLeft = {};
        if (difference >0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => {
            clearTimeout(timerId);
        }
    });

    const TimeStatus = () => {
        if (timeStatus==="untilIdoStart"){
            return (
                <p style={{'font-size': '30px','color':'white', 'font-weight':'normal', 'display': 'flex', 'align-items':'flex-end', 'margin-bottom':'0px'}}>
                    <span style={{'font-size': '35px','font-weight':'800'}}>IDO for</span>
                    &nbsp;
                    <span style={{'font-size': '35px','font-weight':'800','color':'#106A40'}}>ACA</span>
                    <img alt='acaColorLogo' src={acaColorLogo} style={{width:'39px', 'margin-left': '5px'}}/>
                    &nbsp; starts in
                </p>
            )
        } else if (timeStatus==="untilIdoEnd"){
            return (
                <p style={{'font-size': '30px','color':'white', 'font-weight':'normal', 'display': 'flex', 'align-items':'flex-end', 'margin-bottom':'0px'}}>
                    <span style={{'font-size': '35px','font-weight':'800'}}>IDO for</span>
                    &nbsp;
                    <span style={{'font-size': '35px','font-weight':'800','color':'#106A40'}}>ACA</span>
                    <img alt='acaColorLogo' src={acaColorLogo} style={{width:'39px', 'margin-left': '5px'}}/>
                    &nbsp; ends in
                </p>
            )
        } else if (timeStatus==="untilVestingStart"){
            return (
                <p style={{'font-size': '30px','color':'white', 'font-weight':'normal', 'display': 'flex', 'align-items':'flex-end', 'margin-bottom':'0px'}}>
                    <span style={{'font-size': '35px','font-weight':'800'}}>Vesting for</span>
                    &nbsp;
                    <span style={{'font-size': '35px','font-weight':'800','color':'#106A40'}}>ACA</span>
                    <img alt='acaColorLogo' src={acaColorLogo} style={{width:'39px', 'margin-left': '5px'}}/>
                    &nbsp; starts in
                </p>
            )
        } else if (timeStatus==="untilVestingEnd"){
            return (
                <p style={{'font-size': '30px','color':'white', 'font-weight':'normal', 'display': 'flex', 'align-items':'flex-end', 'margin-bottom':'0px'}}>
                    <span style={{'font-size': '35px','font-weight':'800'}}>Vesting for</span>
                    &nbsp;
                    <span style={{'font-size': '35px','font-weight':'800','color':'#106A40'}}>ACA</span>
                    <img alt='acaColorLogo' src={acaColorLogo} style={{width:'39px', 'margin-left': '5px'}}/>
                    &nbsp; ends in
                </p>
            )
        } else if (timeStatus==="vestingEnd"){
            return (
                <p style={{'font-size': '30px','color':'white', 'font-weight':'normal', 'display': 'flex', 'align-items':'flex-end', 'margin-bottom':'0px'}}>
                    <span style={{'font-size': '35px','font-weight':'800'}}>Vesting for</span>
                    &nbsp;
                    <span style={{'font-size': '35px','font-weight':'800','color':'#106A40'}}>ACA</span>
                    <img alt='acaColorLogo' src={acaColorLogo} style={{width:'39px', 'margin-left': '5px'}}/>
                    &nbsp; has ended.
                </p>
            )
        }
        return (
            <p style={{'font-size': '30px','color':'white', 'font-weight':'normal', 'display': 'flex', 'align-items':'flex-end', 'margin-bottom':'0px'}}>
                <span style={{'font-size': '35px','font-weight':'800'}}>Vesting for</span>
                &nbsp;
                <span style={{'font-size': '35px','font-weight':'800','color':'#106A40'}}>ACA</span>
                <img alt='acaColorLogo' src={acaColorLogo} style={{width:'39px', 'margin-left': '5px'}}/>
                &nbsp; has ended.
            </p>
        )
    }
    return (
        <div style={{"display":"flex", "flex-direction":"row", "justify-content":"center", "align-items":"center"}}>
            {timeStatus==="untilIdoStart" || "untilIdoEnd" ?
                <RocketLaunchIcon style={{'fontSize': '100px', 'color':'white','margin-right':'30px'}}/>
                :
                <LockClockIcon style={{'fontSize': '100px', 'color':'white','margin-right':'30px'}}/>
            }
            <div>
                <TimeStatus/>
                <p style={{'font-size': '30px', 'color':'white', 'display':'flex', 'justify-content':'center',"align-items":"flex-end","margin-top":"0px"}}>
                    <span style={{'font-size':'35px','font-weight':'800'}}>{timeLeft.days}</span> &nbsp; <span style={{'font-weight':'normal'}}>days</span> &nbsp;&nbsp;
                    <span style={{'font-size':'35px','font-weight':'800'}}>{timeLeft.hours}</span> &nbsp; <span style={{'font-weight':'normal'}}>hours</span> &nbsp;&nbsp;
                    <span style={{'font-size':'35px','font-weight':'800'}}>{timeLeft.minutes}</span> &nbsp; <span style={{'font-weight':'normal'}}>minutes</span> &nbsp;&nbsp;
                    <span style={{'font-size':'35px','font-weight':'800'}}>{timeLeft.seconds}</span> &nbsp; <span style={{'font-weight':'normal'}}>seconds.</span> &nbsp;&nbsp;
                </p>
            </div>
        </div>
    );
}