// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract WinningNumber {
    uint256 winningNumber;
    uint public mod;
    address public winner;

    constructor(uint256 _mod) {
        mod = _mod;
        winningNumber = block.number % mod;
    }

    function guess(uint256 _guess) public {
        require(_guess == winningNumber, "Wrong Guess!");
        winner = msg.sender;
    }
}
