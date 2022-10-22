export const NETWORKS = {
    localhost: {
        name: "localhost",
        color: "#666666",
        chainId: 1337,
        blockExplorer: "",
        rpcUrl: "http://" + window.location.hostname + ":8545",
    },
    goerli: {
        name: "Goerli",
        color: "#3099f2",
        chainId: 5,
        rpcUrl: `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
        blockExplorer: "https://goerli.etherscan.io/"
      }
};

export const targetNetwork = NETWORKS.localhost;
export const contractAddress = process.env.REACT_APP_CONTROLLER_CONTRACT_ADDRESS ?? "";
