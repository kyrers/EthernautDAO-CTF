// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./WinningNumber.sol";

/**
 * @author kyrers
 */
contract WinningNumberFactory is Challenge {
    uint private mod;

    constructor(uint _mod) {
        mod = _mod;
    }

    function createInstance(address _player) public payable override returns (address) {
        return address(new WinningNumber(mod));
    }

    function createInstanceUsingBurnerWallet(address _player, address _burnerWallet) public payable override returns (address) {
        revert("Can't create instance using a burner wallet");
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        WinningNumber challengeInstance = WinningNumber(_instance);
        return challengeInstance.winner() == _player;
    }
    
    function validateInstanceUsingBurnerWallet(address payable _instance, address _player, address _burnerWallet) public override returns (bool) {
        revert("Can't create instance using a burner wallet");
    }
}
