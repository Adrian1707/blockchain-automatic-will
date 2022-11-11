// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract EstatePlanning {
  event CheckPulse (address beneficiary);
  event HeartBeat (address estateOwner, bool alive);

  address beneficiary;
  address estateOwner;
  uint256 balance;
  uint256 checkPulseTime;
  bool estateOwnerAlive;
  uint immutable waitingThreshold = 30 seconds;

  constructor(address _estateOwner, address _beneficiary) {
    estateOwner = _estateOwner;
    beneficiary = _beneficiary;
    estateOwnerAlive = true;
  }

  function addFunds() public payable {
    if(msg.sender != estateOwner) {
      revert("Can only be funded by the estate owner");
    }
    balance += msg.value;
  }

  function terminate() external payable {
    address payable addr = payable(address(estateOwner));
    selfdestruct(addr);
  }

  function claimInheritance() public payable {
    if(msg.sender != beneficiary) {
      revert("Must be the beneficiary to claim the inheritance");
    }

    if(timePassed() && estateOwnerAlive == false) {
      (bool success, ) = payable(beneficiary).call{value: balance}("");
    } else {
      checkPulse();
    }
  }

  function timePassed() public view returns (bool) {
    return (block.timestamp - checkPulseTime) >= waitingThreshold;
  }

  function heartBeat() external {
    if(msg.sender != estateOwner) {
      revert("Must be the estate owner to send a heart beat");
    }
    estateOwnerAlive = true;
    checkPulseTime = 0;
    emit HeartBeat(msg.sender, true);
  }

  function checkPulse() internal {
    checkPulseTime = block.timestamp;
    estateOwnerAlive = false;
    emit CheckPulse(msg.sender);
  }

  function getEstateOwner() public view returns (address) {
    return estateOwner;
  }

  function getBalance() public view returns(uint256) {
    return balance;
  }

  function getEstateOwnerAlive() public view returns(bool) {
    return estateOwnerAlive;
  }

  function getResponseWindow() public view returns(uint256) {
    return checkPulseTime;
  }
}
