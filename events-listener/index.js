import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress } from './constants.js'
import Web3 from 'web3';
import nodemailer from 'nodemailer'

const web3 = new Web3()
const eventProvider = new Web3.providers.WebsocketProvider('wss://proud-intensive-needle.ethereum-goerli.discover.quiknode.pro/3beafdd13a8c663d29b1bd9ed97224fbd630f6ab/')
web3.setProvider(eventProvider)
console.log("listening through websocket...")

const blockNumber = await web3.eth.getBlockNumber();
const myContract = new web3.eth.Contract(abi, contractAddress);
let options = {
    filter: {
        value: [],
    },
    fromBlock: blockNumber + 1
};

console.log("contractAddress",contractAddress)
let testAccount = await nodemailer.createTestAccount();
let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

console.log("Subscribing to events...")
console.log(myContract.events)
myContract.events.CheckPulse(options)
    .on('data', event => onData(event))
    .on('changed', changed => console.log(changed))
    .on('error', err => console.error(err))
    .on('connected', str => console.log(str))


async function onData(event) {
  console.log("onData")
  console.log(event)
  console.log(event.event)
  if(event.event == "CheckPulse") {
    console.log("Sending email to beneficiary")
     let info = await transporter.sendMail({
       from: '"Estate Planner" <estate-planner@example.com>',
       to: "beneficiary@example.com",
       subject: "Are you dead?",
       text: "Your beneficiary has tried to claim their inheritance. Tell us if you're alive", // plain text body
       html: "<b>Your beneficiary has tried to claim their inheritance. Tell us if you're alive</b>", // html body
     });
     console.log("Message sent: %s", info.messageId);
     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
}
