// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @notice Based on OpenZeppelin Level implementation (https://github.com/OpenZeppelin/ethernaut/blob/master/contracts/contracts/levels/base/Level-08.sol)
 */
abstract contract Challenge is Ownable {
  function createInstance(address _player) virtual public payable returns (address);
  function validateInstance(address payable _instance, address _player) virtual public returns (bool);
}