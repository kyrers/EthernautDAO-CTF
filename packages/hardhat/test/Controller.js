const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Controller", function () {
    let controllerFactory;
    let controllerContract;
    let rndString = process.env.PRIVATE_DATA_RND_STRING;

    beforeEach(async function () {
        controllerFactory = await ethers.getContractFactory("Controller");
        controllerContract = await controllerFactory.deploy();
    });

    describe("### DEPLOYMENT ###", function () {
        it("Should set owner to msg.sender", async function () {
            const [owner] = await ethers.getSigners();
            const contractOwner = await controllerContract.owner();

            expect(owner.address).to.equal(contractOwner);
        });
    });

    describe("### ADD CHALLENGE ###", function () {
        it("Should add challenge", async function () {
            const [owner] = await ethers.getSigners();

            const challengeFactory = await ethers.getContractFactory("PrivateDataFactory");
            const challengeContract = await challengeFactory.deploy(rndString);

            await controllerContract.addLevel(challengeContract.address);

            const challengeExists = await controllerContract.existingChallenges(challengeContract.address);
            expect(challengeExists).to.be.true;
        });

        it("Should fail because it's not the owner", async function () {
            const [owner, signer] = await ethers.getSigners();

            const challengeFactory = await ethers.getContractFactory("PrivateDataFactory");
            const challengeContract = await challengeFactory.deploy(rndString);

            await expect(controllerContract.connect(signer).addLevel(challengeContract.address)).to.be.reverted;
        });
    });

    describe("### CREATE INSTANCE ###", function () {
        it("Should create instance with correct parameters", async function () {
            const [owner, signer] = await ethers.getSigners();

            const challengeFactory = await ethers.getContractFactory("PrivateDataFactory");
            const challengeContract = await challengeFactory.deploy(rndString);

            await controllerContract.addLevel(challengeContract.address);

            const createInstanceTx = await controllerContract.connect(signer).createInstance(challengeContract.address);
            const createInstanceTxReceipt = await createInstanceTx.wait();

            const player = createInstanceTxReceipt.events[0].args[0];
            const challenge = createInstanceTxReceipt.events[0].args[1];

            expect(player).to.equal(signer.address);
            expect(challenge).to.not.equal(ethers.constants.AddressZero);
        });

        it("Should fail because the challenge is not registered", async function () {
            const [owner, signer] = await ethers.getSigners();

            const challengeFactory = await ethers.getContractFactory("PrivateDataFactory");
            const challengeContract = await challengeFactory.deploy(rndString);

            await expect(controllerContract.connect(signer).createInstance(challengeContract.address)).to.be.reverted;
        });
    });

    describe("### VALIDATE SOLUTION ###", function () {

        async function deployPrivateDataChallenge() {
            const [owner, player] = await ethers.getSigners();

            //Deploy the PrivateData Challenge Factory
            const challengeFactoryFactory = await ethers.getContractFactory("PrivateDataFactory");
            const challengeFactoryContract = await challengeFactoryFactory.deploy(rndString);

            //Add the Level
            await controllerContract.addLevel(challengeFactoryContract.address);

            //Create an instance for the player
            const createInstanceTx = await controllerContract.connect(player).createInstance(challengeFactoryContract.address);
            const createInstanceTxReceipt = await createInstanceTx.wait();

            //Get the challenge address
            const challengeAddress = createInstanceTxReceipt.events[0].args[1];

            //Solve the challenge - this is easy for test purposes because we already know the random string used
            const abi = [
                { "inputs": [{ "internalType": "string", "name": "rndString", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" },
                { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Deposit", "type": "event" },
                { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTaken", "type": "event" },
                { "inputs": [], "name": "NUM", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
                { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "addressToKeys", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
                { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
                { "inputs": [{ "internalType": "uint256", "name": "key", "type": "uint256" }], "name": "takeOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
                { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }
            ];

            let challengeContract = new ethers.Contract(challengeAddress, abi, player);

            const deployBlock = await createInstanceTxReceipt.events[0].getBlock();

            return { challengeAddress, challengeContract, deployBlock };
        }

        it("Should validate solution", async function () {
            const [owner, player] = await ethers.getSigners();
            const { challengeAddress, challengeContract, deployBlock } = await deployPrivateDataChallenge();

            let secretKey = ethers.utils.solidityKeccak256(["bytes32", "uint", "string"], [deployBlock.parentHash, deployBlock.timestamp, process.env.PRIVATE_DATA_RND_STRING]);

            await challengeContract.takeOwnership(secretKey);

            //Validate the solution
            await controllerContract.connect(player).validateSolution(challengeAddress);

            let challengeOwner = await challengeContract.owner();
            expect(challengeOwner).to.equal(player.address);
        });

        it("Should fail because this is not the player associated with the challenge instance", async function () {
            const [owner, player, player2] = await ethers.getSigners();
            const { challengeAddress, challengeContract, deployBlock } = await deployPrivateDataChallenge();

            let secretKey = ethers.utils.solidityKeccak256(["bytes32", "uint", "string"], [deployBlock.parentHash, deployBlock.timestamp, process.env.PRIVATE_DATA_RND_STRING]);

            await challengeContract.takeOwnership(secretKey);

            //Validate the solution
            await expect(controllerContract.connect(player2).validateSolution(challengeAddress)).to.be.reverted;
        });

        it("Should fail because challenge instance was already solved", async function () {
            const [owner, player] = await ethers.getSigners();
            const { challengeAddress, challengeContract, deployBlock } = await deployPrivateDataChallenge();

            let secretKey = ethers.utils.solidityKeccak256(["bytes32", "uint", "string"], [deployBlock.parentHash, deployBlock.timestamp, process.env.PRIVATE_DATA_RND_STRING]);

            await challengeContract.takeOwnership(secretKey);

            //Validate the solution
            await controllerContract.connect(player).validateSolution(challengeAddress);

            let challengeOwner = await challengeContract.owner();


            expect(challengeOwner).to.equal(player.address);
            await expect(controllerContract.connect(player).validateSolution(challengeAddress)).to.be.reverted;
        });

        it("Should fail because zero address is not a valid challenge address", async function () {
            const [owner, player] = await ethers.getSigners();
            const { challengeAddress, challengeContract, deployBlock } = await deployPrivateDataChallenge();

            let secretKey = ethers.utils.solidityKeccak256(["bytes32", "uint", "string"], [deployBlock.parentHash, deployBlock.timestamp, process.env.PRIVATE_DATA_RND_STRING]);

            await challengeContract.takeOwnership(secretKey);

            //Validate the solution
            await expect(controllerContract.connect(player).validateSolution(ethers.constants.AddressZero)).to.be.reverted;
        });
    });
});