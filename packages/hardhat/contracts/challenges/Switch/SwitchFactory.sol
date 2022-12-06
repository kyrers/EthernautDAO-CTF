// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./Switch.sol";

/**
 * @author kyrers
 */
contract SwitchFactory is Challenge {
    function createInstance(address _player) public payable override returns (address) {
        return address(new Switch());
    }

    function createInstanceUsingBurnerWallet(address _player, address _burnerWallet) public payable override returns (address) {
        revert("Can't create instance using a burner wallet");
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        Switch challengeInstance = Switch(_instance);
        return challengeInstance.owner() == _player;
    }
    
    function validateInstanceUsingBurnerWallet(address payable _instance, address _player, address _burnerWallet) public override returns (bool) {
        revert("Can't validate instance using a burner wallet");
    }
}
