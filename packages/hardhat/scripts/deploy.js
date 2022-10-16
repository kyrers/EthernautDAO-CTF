const { ethers } = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();

    const controllerFactory = await ethers.getContractFactory("Controller");
    const controllerContract = await controllerFactory.deploy();
    await controllerContract.deployed();

    const controllerOwner = await controllerContract.owner();
    console.log(`Controller deployed to ${controllerContract.address} and the owner is: ${controllerOwner}`);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });