const { deployments, ethers, getNamedAccounts } = require('hardhat')
const { assert, expect } = require('chai')
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("EstatePlanning", function () {
  beforeEach(async function() {
    await deployments.fixture(["all"])
    estateOwner = (await getNamedAccounts()).estateOwner
    estatePlanning = await ethers.getContract("EstatePlanning", estateOwner)
  })

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await estatePlanning.getEstateOwner()).to.equal(estateOwner);
    });

    it("Should set the estate owner to alive", async function() {
      expect(await estatePlanning.getEstateOwnerAlive()).to.equal(true);
    });
  })

  describe("transfer", function() {
    it("Should transfer funds to the contract balance", async function() {
      await estatePlanning.addFunds({value: ethers.utils.parseEther("2.0")})
      const contractBalance = await estatePlanning.getBalance();
      expect(contractBalance.toString()).to.equal(ethers.utils.parseEther("2.0"))
    })

    it("should not allow transfers for accounts other than beneficiary or estate owner", async function() {
      otherAccount = (await getNamedAccounts()).otherAccount
      estatePlanning = await ethers.getContract("EstatePlanning", otherAccount)
      expect(estatePlanning.addFunds({value: ethers.utils.parseEther("2.0")})).to.be.revertedWith(
        "Must be either beneficiary or owner to pay into the contract"
      )
    })
  })

  describe("claimInheritance", function() {
    it("Should send an event when the claimInheritance is called", async function () {
      await estatePlanning.addFunds({value: ethers.utils.parseEther("2.0")})

      beneficiary = (await getNamedAccounts()).beneficiary
      estatePlanning = await ethers.getContract("EstatePlanning", beneficiary)
      const transactionResponse = await estatePlanning.claimInheritance()

      const transactionReceipt = await transactionResponse.wait(1)
      expect(transactionReceipt.events[0].event).to.equal("CheckPulse")
    })

    it("Pay the beneficiary 30 seconds after last pulse check", async function() {
      beneficiary = (await getNamedAccounts()).beneficiary
      beneficiaryBalance = await ethers.provider.getBalance(beneficiary)
      expect(beneficiaryBalance).to.equal('10000000000000000000000')
      await estatePlanning.addFunds({value: ethers.utils.parseEther("9999.0")})
      originalBeneficiaryBalance = await ethers.provider.getBalance(beneficiary)
      estatePlanning = await ethers.getContract("EstatePlanning", beneficiary)
      await estatePlanning.claimInheritance()

      latestTime = await time.latest();
      newTime = await time.increase(30);
      await estatePlanning.claimInheritance()
      newBeneficiaryBalance = await ethers.provider.getBalance(beneficiary)
      expect(newBeneficiaryBalance.toString().startsWith('1999')).to.equal(true)
    })

    it("Pay the beneficiary 30 seconds after last pulse check", async function() {
      beneficiary = (await getNamedAccounts()).beneficiary
      beneficiaryBalance = await ethers.provider.getBalance(beneficiary)
      expect(beneficiaryBalance).to.equal('10000000000000000000000')
      await estatePlanning.addFunds({value: ethers.utils.parseEther("9999.0")})
      originalBeneficiaryBalance = await ethers.provider.getBalance(beneficiary)
      estatePlanning = await ethers.getContract("EstatePlanning", beneficiary)
      await estatePlanning.claimInheritance()

      newTime = await time.increase(35);
      await estatePlanning.claimInheritance()
      newBeneficiaryBalance = await ethers.provider.getBalance(beneficiary)
      expect(newBeneficiaryBalance.toString().startsWith('1999')).to.equal(true)
    })

    it("Does not pay the beneficiary before the 30 second cutoff", async function() {
      beneficiary = (await getNamedAccounts()).beneficiary
      beneficiaryBalance = await ethers.provider.getBalance(beneficiary)
      expect(beneficiaryBalance).to.equal('10000000000000000000000')
      await estatePlanning.addFunds({value: ethers.utils.parseEther("9999.0")})
      originalBeneficiaryBalance = await ethers.provider.getBalance(beneficiary)
      estatePlanning = await ethers.getContract("EstatePlanning", beneficiary)
      await estatePlanning.claimInheritance()

      latestTime = await time.latest();
      newTime = await time.increase(26);
      await estatePlanning.claimInheritance()
      newBeneficiaryBalance = await ethers.provider.getBalance(beneficiary)
      expect(newBeneficiaryBalance.toString().startsWith('1999')).to.equal(false)
    })

    it("should not allow anyone other than the beneficiary to claim the inheritance", async function() {
      otherAccount = (await getNamedAccounts()).otherAccount
      estatePlanning = await ethers.getContract("EstatePlanning", otherAccount)
      expect(estatePlanning.claimInheritance).to.be.revertedWith(
        "Must be the beneficiary to claim the inheritance"
      )
    })
  })

  describe("heartBeat", function() {
    it("Should send a heart beat event", async function() {
      const transactionResponse = await estatePlanning.heartBeat()
      const transactionReceipt = await transactionResponse.wait(1)
      expect(transactionReceipt.events[0].event).to.equal("HeartBeat")
    })

    it("Should reset the request window", async function() {
      await estatePlanning.heartBeat()
      const responseWindow = await estatePlanning.getResponseWindow()

      expect(responseWindow).to.equal(0)
    })

    it("Should set the estate owner as alive", async function() {
      await estatePlanning.heartBeat()
      const estateOwnerAlive = await estatePlanning.getEstateOwnerAlive()

      expect(estateOwnerAlive).to.equal(true)
    })

    it("Should only let estate owner send a heartbeat", async function() {
      beneficiary = (await getNamedAccounts()).beneficiary
      estatePlanning = await ethers.getContract("EstatePlanning", beneficiary)

      expect(estatePlanning.heartBeat()).to.be.revertedWith(
        "Must be the estate owner to send a heart beat"
      )
    })
  })
});
