// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./Vault.sol";
import "./Vesting.sol";

/**
 * @author kyrers
 */
contract VaultFactory is Challenge {
    function createInstance(address _player) public payable override returns (address) {
        revert("Can't create instance without using a burner wallet");
    }

    function createInstanceUsingBurnerWallet(address _player, address _burnerWallet) public payable override returns (address) {
        require(0.1 ether <= msg.value, "Not enough ether sent");

        Vesting vesting = new Vesting();
        Vault vault = new Vault(_burnerWallet, address(vesting));

        (bool sent, bytes memory data) = address(vault).call{value: msg.value }("");
        require(sent, "Failed to set up the challenge. Please try again.");

        return address(vault);
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        Vault challengeInstance = Vault(_instance);
        return 0 ether == address(challengeInstance).balance;
    }

    function validateInstanceUsingBurnerWallet(address payable _instance, address _player, address _burnerWallet) public override returns (bool) {
        revert("Can't validate instance using a burner wallet");
    }
}
