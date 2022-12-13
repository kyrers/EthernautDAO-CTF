// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./VNFT.sol";

/**
 * @author kyrers
 */
contract VNFTFactory is Challenge {
    function createInstance(address _player) public payable override returns (address) {
        revert("Can't create instance without using a burner wallet");
    }

    function createInstanceUsingBurnerWallet(address _player, address _burnerWallet) public payable override returns (address) {
        //Burner wallet is required to make a transaction after deploy, so the user needs to send some ether for gas
        require(0.1 ether <= msg.value, "Not enough ether sent");
        bool success = payable(_burnerWallet).send(msg.value);
        require(success, "Failed to create instance. Please try again.");

        return address(new VNFT(_burnerWallet));
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        VNFT challengeInstance = VNFT(_instance);
        return 2 < challengeInstance.balanceOf(_player);
    }

    function validateInstanceUsingBurnerWallet(address payable _instance, address _player, address _burnerWallet) public override returns (bool) {
        revert("Can't validate instance using a burner wallet");
    }
}
