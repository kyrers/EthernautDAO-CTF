// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Challenge.sol";

/**
* @notice This contract controls the deployment and solving of level instances 
* @author kyrers
*/
contract Controller is Ownable {
    /*------------------------------------------------------------
                                 VARIABLES
    --------------------------------------------------------------*/
    struct LevelData {
        address player;
        Challenge challenge;
        bool solved;
    }

    mapping (address => bool) existingChallenges;
    mapping (address => LevelData) challengeInstances;

    /**
     * @notice Only the owner can add new challenges
     * @param _challenge The new challenge address
     */
    function addLevel(address _challenge) external onlyOwner {
        existingChallenges[_challenge] = true;
    }

     /**
     * @notice Create a new challenge instance
     * @param _challenge The challenge for which to create the new instance
     */
    function createInstance(address _challenge) external payable {

    }

    /**
     * @notice Validate the solution for a specific challenge
     * @param _challenge The challenge to verify
     */
    function validateSolution(address payable _challenge) external {

    }
}