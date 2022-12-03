// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./CarMarket.sol";
import "./CarToken.sol";
import "./CarFactory.sol";

/**
 * @author kyrers
 */
contract CarMarketFactory is Challenge {
    function createInstance(address _player) public payable override returns (address) {
        CarToken carToken = new CarToken();
        CarMarket carMarket = new CarMarket(address(carToken));
        CarFactory carFactory = new CarFactory(address(carMarket), address(carToken));

        carToken.priviledgedMint(address(carMarket), 100000 ether);
        carToken.priviledgedMint(address(carFactory), 100000 ether);
        carMarket.setCarFactory(address(carFactory));

        return address(carMarket);
    }

    function createInstanceUsingBurnerWallet(address _player, address _burnerWallet) public payable override returns (address) {
        revert("Can't create instance using a burner wallet");
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        CarMarket challengeInstance = CarMarket(_instance);
        return challengeInstance.getCarCount(_player) > 1;
    }

    function validateInstanceUsingBurnerWallet(address payable _instance, address _player, address _burnerWallet) public override returns (bool) {
        revert("Can't create instance using a burner wallet");
    }
}
