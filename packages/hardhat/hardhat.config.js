require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    localhost: {
      url: "http://localhost:8545"
    },
    "optimistic-goerli": {
      url: `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [`${process.env.OPTIMISTIC_GOERLI_ACCOUNT_PK}`]
    }
  },
  etherscan: {
    apiKey: `${process.env.OPTIMISTIC_ETHERSCAN_API_KEY}`
  }
};
