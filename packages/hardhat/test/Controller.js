const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Controller", function () {
    let factory;
    let contract;

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
            console.log("** TO DO **")
        });

        it("Should fail because it's not the owner", async function () {
            console.log("** TO DO **")
        });
    });

    describe("### CREATE INSTANCE ###", function () {
        it("Should create instance", async function () {
            console.log("** TO DO **")
        });

        it("Should fail because the challenge is not registered", async function () {
            console.log("** TO DO **")
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