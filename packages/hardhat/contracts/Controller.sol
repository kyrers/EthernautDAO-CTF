// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Challenge.sol";

/**
 * @notice This contract controls the deployment and solving of challenge instances. Based on OpenZepellin Ethernaut implementation (https://github.com/OpenZeppelin/ethernaut/blob/master/contracts/contracts/Ethernaut.sol)
 * @author kyrers
 */
contract Controller is Ownable {
    /*------------------------------------------------------------
                                 VARIABLES
    --------------------------------------------------------------*/
    struct ChallengeData {
        address player;
        Challenge challenge;
        bool solved;
    }

    mapping(address => bool) public existingChallenges;
    mapping(address => ChallengeData) public challengeInstances;

    /*------------------------------------------------------------
                                 EVENTS
    --------------------------------------------------------------*/
    event InstanceCreated(address _player, address _challenge);
    event InstanceSolved(address _player, Challenge _challenge);

    /*------------------------------------------------------------
                                 FUNCTIONS
    --------------------------------------------------------------*/
    /**
     * @notice Only the owner can add new challenges
     * @param _challenge The new challenge
     */
    function addChallenge(Challenge _challenge) external onlyOwner {
        require(!existingChallenges[address(_challenge)], "This challenge is already registered!");
        existingChallenges[address(_challenge)] = true;
    }

    /**
     * @notice Create a new challenge instance
     * @param _challenge The challenge for which to create the new instance
     */
    function createInstance(Challenge _challenge) external payable {
        require(existingChallenges[address(_challenge)], "This challenge is not registered!");

        address instance = _challenge.createInstance{value: msg.value}(msg.sender);

        challengeInstances[instance] = ChallengeData(msg.sender, _challenge, false);

        emit InstanceCreated(msg.sender, instance);
    }

     /**
     * @notice Create a new challenge instance with the use of a burner wallet
     * @param _challenge The challenge for which to create the new instance
     * @param _burnerWallet The burner wallet address
     */
    function createInstanceUsingBurnerWallet(Challenge _challenge, address _burnerWallet) external payable {
        require(existingChallenges[address(_challenge)], "This challenge is not registered!");

        address instance = _challenge.createInstanceUsingBurnerWallet{value: msg.value}(msg.sender, _burnerWallet);

        challengeInstances[instance] = ChallengeData(msg.sender, _challenge, false);

        emit InstanceCreated(msg.sender, instance);
    }

    /**
     * @notice Validate the solution for a specific challenge
     * @param _challenge The challenge to verify
     */
    function validateSolution(address payable _challenge) external {
        require(_challenge != address(0), "Zero address is not a valid challenge address!");
        ChallengeData storage challengeData = challengeInstances[_challenge];

        require(challengeData.player == msg.sender, "This player is not associated with this challenge instance!");
        require(challengeData.solved == false, "Already solved!");

        if (challengeData.challenge.validateInstance(_challenge, msg.sender)) {
            challengeData.solved = true;
            emit InstanceSolved(msg.sender, challengeData.challenge);
        }
    }

    /**
     * @notice Validate the solution for a specific challenge using a burner wallet
     * @param _challenge The challenge to verify
     * @param _burnerWallet The burner wallet address
     */
    function validateSolutionUsingBurnerWallet(address payable _challenge, address _burnerWallet) external {
        require(_challenge != address(0), "Zero address is not a valid challenge address!");
        ChallengeData storage challengeData = challengeInstances[_challenge];

        require(challengeData.player == msg.sender, "This player is not associated with this challenge instance!");
        require(challengeData.solved == false, "Already solved!");

        if (challengeData.challenge.validateInstanceUsingBurnerWallet(_challenge, msg.sender, _burnerWallet)) {
            challengeData.solved = true;
            emit InstanceSolved(msg.sender, challengeData.challenge);
        }
    }
}
