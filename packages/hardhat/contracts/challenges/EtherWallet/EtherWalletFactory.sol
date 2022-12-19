// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./EtherWallet.sol";

/**
 * @author kyrers
 */
contract EtherWalletFactory is Challenge {
    function createInstance(address _player) public payable override returns (address) {
        revert("Can't create instance without using a burner wallet");
    }

    function createInstanceUsingBurnerWallet(address _player, address _burnerWallet) public payable override returns (address) {
        require(0.1 ether <= msg.value, "Not enough ether sent");
        
        //Send the msg.value to burner wallet because it's required to make a transaction after deploy, so it needs some ether for gas. The remaining will be deposited into the wallet
        bool success = payable(_burnerWallet).send(msg.value);
        require(success, "Failed to create instance. Please try again.");

        return address(new EtherWallet(_burnerWallet));
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        EtherWallet challengeInstance = EtherWallet(_instance);
        return 0 ether == address(challengeInstance).balance;
    }

    function validateInstanceUsingBurnerWallet(address payable _instance, address _player, address _burnerWallet) public override returns (bool) {
        revert("Can't validate instance using a burner wallet");
    }
}
