// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./EthernautDAOToken.sol";

/**
 * @author kyrers
 */
contract EthernautDAOTokenFactory is Challenge {
    function createInstance(address _player) public payable override returns (address) {
        revert("Can't create instance without using a burner wallet");
    }

    function createInstanceUsingBurnerWallet(address _player, address _burnerWallet) public payable override returns (address) {
        return address(new EthernautDAOToken(_burnerWallet));
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        revert("Can't validate instance without using a burner wallet");
    }

    function validateInstanceUsingBurnerWallet(address payable _instance, address _player, address _burnerWallet) public override returns (bool) {
        EthernautDAOToken challengeInstance = EthernautDAOToken(_instance);
        return 0 >= challengeInstance.balanceOf(_burnerWallet) && 0 < challengeInstance.balanceOf(_player);
    }
}
