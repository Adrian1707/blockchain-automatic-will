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
  uint256 responseWindow;
  bool estateOwnerAlive;
  uint immutable waitingThreshold = 2 minutes * 1000;

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

    uint256 timeElapsed = (block.timestamp - responseWindow);
    if(timeElapsed > waitingThreshold && estateOwnerAlive != true) {
      (bool success, ) = payable(beneficiary).call{value: balance}("");
    } else {
      checkPulse();
    }
  }

  function heartBeat() external {
    if(msg.sender != estateOwner) {
      revert("Must be the estate owner to send a heart beat");
    }
    estateOwnerAlive = true;
    responseWindow = 0;
    emit HeartBeat(msg.sender, true);
  }

  function checkPulse() internal {
    responseWindow = block.timestamp;
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
    return responseWindow;
  }
}
