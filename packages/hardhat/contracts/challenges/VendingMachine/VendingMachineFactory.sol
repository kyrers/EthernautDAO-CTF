// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./VendingMachine.sol";

/**
 * @author kyrers
 */
contract VendingMachineFactory is Challenge {
    event Received(address, uint256);

    constructor() payable {}

    function createInstance(address _player) public payable override returns (address) {
        require(0.1 ether <= address(this).balance, "The factory does not have sufficient funds. Please, contact the developers");
        return address(new VendingMachine{value: 0.1 ether}());
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

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
