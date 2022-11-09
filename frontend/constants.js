export const contractAddress = '0x13fE1309b2CfFC620e6f0B183Ee0Bb782d8C2C56'
export const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_estateOwner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_beneficiary",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      }
    ],
    "name": "CheckPulse",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "estateOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "alive",
        "type": "bool"
      }
    ],
    "name": "HeartBeat",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "addFunds",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimInheritance",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEstateOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEstateOwnerAlive",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getResponseWindow",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "heartBeat",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "terminate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]
