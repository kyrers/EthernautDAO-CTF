const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [owner] = await ethers.getSigners();

  //Deploy controller
  console.log("## Deploying controller...");
  const controllerFactory = await ethers.getContractFactory("Controller");
  const controllerContract = await controllerFactory.deploy();
  await controllerContract.deployed();
  console.log(`Controller deployed to ${controllerContract.address}`);

  //Deploy challenges factory contracts
  console.log("## Deploying challenges factories...");
  const privateDataFactory = await ethers.getContractFactory("PrivateDataFactory");
  const privateDataFactoryContract = await privateDataFactory.deploy(process.env.PRIVATE_DATA_RND_STRING);
  console.log(`Private Data Factory deployed to ${privateDataFactoryContract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });