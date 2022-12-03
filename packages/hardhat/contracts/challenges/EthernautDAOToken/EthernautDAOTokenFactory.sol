// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./EthernautDAOToken.sol";

/**
 * @author kyrers
 */
contract EthernautDAOTokenFactory is Challenge {
    address private deployer;


    function createInstance(address _player) public payable override returns (address) {
        deployer = msg.sender;
        return address(new EthernautDAOToken());
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        EthernautDAOToken challengeInstance = EthernautDAOToken(_instance);
        return 0 == challengeInstance.balanceOf(deployer) && 0 < challengeInstance.balanceOf(_player);
    }
}
