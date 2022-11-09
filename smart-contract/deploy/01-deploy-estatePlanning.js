const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async ({getNamedAccounts, deployements}) => {
  const { deploy, log } = deployments
  const { estateOwner, beneficiary } = await getNamedAccounts()
  // const estateOwner = "0x3562aEfEB08Efc77538a0ECcFdb5325d990e0af5"
  // const beneficiary = "0x0047cB62B6e5BdAd8B094F954Ad8241edE4372d0"
  const { networkConfig } = require("../helper-hardhat-config")
  console.log("deploying.....")
  const estatePlanning = await deploy("EstatePlanning", {
    from: estateOwner,
    log: true,
    args: [estateOwner, beneficiary]
  })
}

module.exports.tags = ['all']
