// import Caver from "caver-js";
// const caver = new Caver('https://kaikas.cypress.klaytn.net:8651');
// const donationAddress = "";
// const donationAbi = require("./donationAbi.json");
// const donationInstance = new caver.klay.Contract(donationAddress, donationAbi);

//getDonator
// async function getDonator(order){
//     let address, amount, time = await donationInstance.methods.getDonator(order).call();
//     return address, shiftdown(amount), time;
// }

//convert BigNUmber
// function shiftdown(num, n)
// {
//     if(n > 0) console.log("SHIFTDOWN WARNING");
//     var result = num.multipliedBy(Math.pow(10, n));
//     return result.toFixed(6);
// }

//create array of donator objects storing top 10 donators
// var top10Donations = [];
// for (var i = 0; i<10; i++) {
//     let address, amount, time = await getDonator(i)
//     var donationObj = {
//         address: address,
//         amount: amount,
//         time: time
//     }
//     top10Donations.push(donationObj)
// }

//getOrder
// async function getOrder(){
//     let order = await donationInstance.methods.getOrder();
//     return order;
// }

//example top 10 donators
const top10Donations = [
    { address: "0x123...678", amount: 100, time: "2022 March" },
    { address: "0x123...678", amount: 100, time: "2022 March" },
    { address: "0x123...678", amount: 100, time: "2022 March" },
    { address: "0x123...678", amount: 100, time: "2022 March" },
    { address: "0x123...678", amount: 100, time: "2022 March" },
];

const donationDiv = document.querySelector(".donationboard")
let tableHeaders = ["Address", "Amount", "Time"];

function createDonationboard() {
    console.log("createDonationboard is called")
    //clear donation board first
    while (donationDiv.firstChild) donationDiv.removeChild(donationDiv.firstChild)

    let donationboardTable = document.createElement('table')
    donationboardTable.className = 'donationboardTable'

    let donationboardTableHead = document.createElement('thead')
    donationboardTableHead.className = 'donationboardTableHead'

    let donationboardTableHeaderRow = document.createElement('tr')
    donationboardTableHeaderRow.className = 'donationboardTableHeaderRow'

    tableHeaders.forEach(header => {
        let donationHeader=document.createElement('th')
        donationHeader.innerText=header
        donationboardTableHeaderRow.append(donationHeader)
    })

    donationboardTableHead.append(donationboardTableHeaderRow)
    donationboardTable.append(donationboardTableHead)

    let donationboardTableBody = document.createElement('tbody')
    donationboardTableBody.className='donationboardTableBody'
    donationboardTable.append(donationboardTableBody)

    donationDiv.append(donationboardTable)

    for (const donation of top10Donations) {
        appendDonations(donation) // Creates and appends each row to the table body
    }
}

const appendDonations = (donation) => {
    const donationboardTable = document.querySelector('.donationboardTable')
    let donationboardTableBodyRow = document.createElement('tr')
    donationboardTableBodyRow.className = 'scoreboardTableBodyRow'
    let address = document.createElement('td')
    address.innerText = donation.address
    let amount = document.createElement('td')
    amount.innerText = donation.amount + ' KLAY'
    let time = document.createElement('td')
    time.innerText = donation.time
    donationboardTableBodyRow.append(address, amount, time)
    donationboardTable.append(donationboardTableBodyRow)
}

const copyDonationAddress = () => {
    navigator.clipboard.writeText('0x9ac97E2647F75d1191EB8D5aA6916215b707843c')
}

