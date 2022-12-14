// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./Staking.sol";
import "./RewardToken.sol";
import "./StakingToken.sol";
import "./MockERC20.sol";

/**
 * @author kyrers
 */
contract StakingFactory is Challenge {
    function createInstance(address _player) public payable override returns (address) {
        MockERC20 mockERC20 = new MockERC20();
        StakingToken stakingToken = new StakingToken();

        //Not really important who the lpStaker is, so we'll use the _player address
        RewardToken rewardToken = new RewardToken("RewardToken", "RT", _player);

        Staking staking = new Staking(address(stakingToken));

        //Set up reward contract
        rewardToken.addReward(address(mockERC20), address(this), 86400 * 7 * 12);
        rewardToken.mint(address(this), 10000000000 ether);
        rewardToken.approve(address(staking), type(uint256).max);

        //Set up staking contract
        staking.addReward(address(rewardToken), address(this), 86400 * 7 * 12);
        staking.notifyRewardAmount(address(rewardToken), 1000000 ether);

        return address(staking);
    }

    function createInstanceUsingBurnerWallet(address _player, address _burnerWallet) public payable override returns (address) {
        revert("Can't create instance using a burner wallet");
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        Staking challengeInstance = Staking(_instance);
        return challengeInstance.paused();
    }

    function validateInstanceUsingBurnerWallet(address payable _instance, address _player, address _burnerWallet) public override returns (bool) {
        revert("Can't validate instance using a burner wallet");
    }
}
