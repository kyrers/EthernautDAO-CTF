// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./VendingMachine.sol";

/**
 * @author kyrers
 */
contract VendingMachineFactory is Challenge {
    function createInstance(address _player) public payable override returns (address) {
        require(0.1 ether <= msg.value, "Not enough ether sent");
        return address(new VendingMachine{value: msg.value}());
    }

    function createInstanceUsingBurnerWallet(address _player, address _burnerWallet) public payable override returns (address) {
        revert("Can't create instance using a burner wallet");
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        return 0.1 ether <= _player.balance && 0 ether == _instance.balance;
    }

    function validateInstanceUsingBurnerWallet(address payable _instance, address _player, address _burnerWallet) public override returns (bool) {
        revert("Can't validate instance using a burner wallet");
    }
}
