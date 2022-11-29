// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./PrivateData.sol";

/**
 * @author kyrers
 */contract PrivateDataFactory is Challenge {
    string private rndString;

    constructor(string memory _rndString) {
        rndString = _rndString;
    }

    function createInstance(address _player) public payable override returns (address) {
        return address(new PrivateData(rndString));
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        PrivateData challengeInstance = PrivateData(_instance);
        return challengeInstance.owner() == _player;
    }
}
