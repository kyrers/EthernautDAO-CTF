const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Controller", function () {
    let factory;
    let contract;
    let rndString = process.env.PRIVATE_DATA_RND_STRING;

    beforeEach(async function () {
        factory = await ethers.getContractFactory("Controller");
        contract = await factory.deploy();
    });

    describe("### DEPLOYMENT ###", function () {
        it("Should set owner to msg.sender", async function () {
            const [owner] = await ethers.getSigners();
            const contractOwner = await contract.owner();

            expect(owner.address).to.equal(contractOwner);
        });
    });

    describe("### ADD CHALLENGE ###", function () {
        it("Should add challenge", async function () {
            const [owner] = await ethers.getSigners();

            const challengeFactory = await ethers.getContractFactory("PrivateDataFactory");
            const challengeContract = await challengeFactory.deploy(rndString);

            await contract.addLevel(challengeContract.address);

            const challengeExists = await contract.existingChallenges(challengeContract.address);
            expect(challengeExists).to.be.true;
        });

        it("Should fail because it's not the owner", async function () {
            const [owner, signer] = await ethers.getSigners();

            const challengeFactory = await ethers.getContractFactory("PrivateDataFactory");
            const challengeContract = await challengeFactory.deploy(rndString);

            await expect(contract.connect(signer).addLevel(challengeContract.address)).to.be.reverted;
        });
    });

    describe("### CREATE INSTANCE ###", function () {
        it("Should create instance with correct parameters", async function () {
            const [owner, signer] = await ethers.getSigners();

            const challengeFactory = await ethers.getContractFactory("PrivateDataFactory");
            const challengeContract = await challengeFactory.deploy(rndString);

            await contract.addLevel(challengeContract.address);

            const createInstanceTx = await contract.connect(signer).createInstance(challengeContract.address);
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

            await expect(contract.connect(signer).createInstance(challengeContract.address)).to.be.reverted;
        });
    });

    describe("### VALIDATE SOLUTION ###", function () {
        it("Should validate solution", async function () {
            console.log("** TO DO **")
        });

        it("Should fail because this is not the player associated with the challenge instance", async function () {
            console.log("** TO DO **")
        });

        it("Should fail because challenge instance was already solved", async function () {
            console.log("** TO DO **")
        });
    });
});