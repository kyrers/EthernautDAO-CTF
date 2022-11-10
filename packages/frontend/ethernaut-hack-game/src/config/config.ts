//Configure hljs to recognize solidity
import hljsDefineSolidity from "highlightjs-solidity";
import hljs from "highlight.js";
hljsDefineSolidity(hljs);
//----

export const NETWORKS = {
    localhost: {
        name: "localhost",
        color: "#666666",
        chainId: 1337,
        blockExplorer: "",
        rpcUrl: "http://" + window.location.hostname + ":8545",
    },
    "optimistic-goerli": {
        name: "Optimistic-Goerli",
        color: "#f01a37",
        chainId: 420,
        rpcUrl: `https://opt-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
        blockExplorer: "https://goerli-optimism.etherscan.io/"
      }
};

export const targetNetwork = NETWORKS["optimistic-goerli"];
export const contractAddress = process.env.REACT_APP_CONTROLLER_CONTRACT_ADDRESS ?? "";
