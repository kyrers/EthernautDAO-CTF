require("@nomicfoundation/hardhat-toolbox");

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
    }
  }
};
