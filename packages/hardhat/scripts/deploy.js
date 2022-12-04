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
  console.log(`Private Data Factory deployed at ${privateDataFactoryContract.address}`);

  const lightweightMultisigWalletFactory = await ethers.getContractFactory("LightweightMultisigWalletFactory");
  const lightweightMultisigWalletFactoryContract = await lightweightMultisigWalletFactory.deploy(process.env.WALLET_LIBRARY_ADDRESS);
  console.log(`Lightweight Multisig Wallet Factory deployed at ${lightweightMultisigWalletFactoryContract.address}`);

  const carMarketFactory = await ethers.getContractFactory("CarMarketFactory");
  const carMarketFactoryContract = await carMarketFactory.deploy();
  console.log(`Car Market Factory deployed at ${carMarketFactoryContract.address}`);

  const vendingMachineFactory = await ethers.getContractFactory("VendingMachineFactory");
  const vendingMachineFactoryContract = await vendingMachineFactory.deploy({ value: ethers.utils.parseEther("0.1") });
  console.log(`Vending Machine Factory deployed at ${vendingMachineFactoryContract.address}`);

  const ethernautDAOTokenFactory = await ethers.getContractFactory("EthernautDAOTokenFactory");
  const ethernautDAOTokenFactoryContract = await ethernautDAOTokenFactory.deploy();
  console.log(`Ethernaut DAO Token Factory deployed at ${ethernautDAOTokenFactoryContract.address}`);

  const winningNumberFactory = await ethers.getContractFactory("WinningNumberFactory");
  const winningNumberFactoryContract = await winningNumberFactory.deploy(process.env.MOD);
  console.log(`Winning Number Factory deployed at ${winningNumberFactoryContract.address}`);

  //Register challenges
  console.log("## Registering challenges...");
  await controllerContract.addChallenge(privateDataFactoryContract.address);
  await controllerContract.addChallenge(lightweightMultisigWalletFactoryContract.address);
  await controllerContract.addChallenge(carMarketFactoryContract.address);
  await controllerContract.addChallenge(vendingMachineFactoryContract.address);
  await controllerContract.addChallenge(ethernautDAOTokenFactoryContract.address);
  await controllerContract.addChallenge(winningNumberFactoryContract.address);
  console.log("## Done!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });