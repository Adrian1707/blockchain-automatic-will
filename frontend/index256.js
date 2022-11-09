// import Web3 from './web3'
// const Web3 = require('web3');
// const web3 = new Web3();
 // import Web3 from 'web3'
// import Contract from 'web3-eth-contract'
// import { server } from 'server'
import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById("connect")
const claimButton = document.getElementById("claim")
const fundButton = document.getElementById("fund")
const heartbeatButton = document.getElementById("heartbeat")
const terminateButton = document.getElementById("terminate")

connectButton.onclick = connect
claimButton.onclick = claim
fundButton.onsubmit = fund
heartbeatButton.onclick = heartbeat
terminateButton.onclick = terminateContract

async function connect(){
  console.log("CONNECTING!!!")
  await ethereum.request({ method: 'eth_requestAccounts' })
  connectButton.innerHTML="Disconnect"
}

async function terminateContract() {
  const provider = getProvider()
  const contract = await getContract()
  try {
    const transactionResponse = await contract.terminate()
    await listenForTransactionMine(transactionResponse, provider)
    console.log("Done")
  } catch(error) {
    alert("Funding cancelled")
    console.log(error)
  }
}

async function getContract() {
  const provider = getProvider()
  const signer = provider.getSigner()
  return new ethers.Contract(contractAddress, abi, signer)
}

function getProvider() {
  return new ethers.providers.Web3Provider(window.ethereum)
}

async function claim() {
  const provider = getProvider()
  const contract = await getContract()
  try {
    const transactionResponse = await contract.claimInheritance()
    await listenForTransactionMine(transactionResponse, provider)
    console.log("Claim complete")
  } catch(error) {
    alert("Claim cancelled")
    console.log(error)
  }
}

async function fund(event) {
  event.preventDefault();
  let etherToSubmit = event.target[0].value
  console.log(ethers.utils.parseEther(etherToSubmit).toString())
  const provider = getProvider()
  const contract = await getContract()
  try {
    const transactionResponse = await contract.addFunds({value: ethers.utils.parseEther(etherToSubmit)})
    await listenForTransactionMine(transactionResponse, provider)
    console.log("Done")
  } catch(error) {
    alert("Funding cancelled")
    console.log(error)
  }
}

async function heartbeat() {
  const provider = getProvider()
  const contract = await getContract()
  try {
    const transactionResponse = await contract.heartBeat()
  } catch(error) {
    console.log(error)
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`Completed with ${transactionReceipt.confirmations}`)
      resolve()
    })
  })
}
