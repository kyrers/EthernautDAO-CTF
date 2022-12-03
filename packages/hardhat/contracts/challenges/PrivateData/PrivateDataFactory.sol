// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./PrivateData.sol";

/**
 * @author kyrers
 */
contract PrivateDataFactory is Challenge {
    string private rndString;

    constructor(string memory _rndString) {
        rndString = _rndString;
    }

    function createInstance(address _player) public payable override returns (address) {
        return address(new PrivateData(rndString));
    }

    function createInstanceUsingBurnerWallet(address _player, address _burnerWallet) public payable override returns (address) {
        revert("Can't create instance using a burner wallet");
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        PrivateData challengeInstance = PrivateData(_instance);
        return challengeInstance.owner() == _player;
    }
    
    function validateInstanceUsingBurnerWallet(address payable _instance, address _player, address _burnerWallet) public override returns (bool) {
        revert("Can't create instance using a burner wallet");
    }
}
