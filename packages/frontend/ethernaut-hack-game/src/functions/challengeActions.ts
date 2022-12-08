import { Contract, ethers } from "ethers";
import { loadPlayerStorage } from "./playerActions";

export const createChallengeInstance: any = async (controller: Contract, challengeId: number, factoryAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
    switch (challengeId) {
        case 5: //User needs to know a wallet PK
            return createEthernautDAOTokenInstance(controller, challengeId, factoryAddress, displayAlert);
        case 8: //A transaction to the contract is needed so the user knows an hash and signature from the contract owner
            return createVNFTInstance(controller, challengeId, factoryAddress, displayAlert);
        default:
            return createDefaultInstance(controller, challengeId, factoryAddress, displayAlert);

    }

};

const createDefaultInstance: any = async (controller: Contract, challengeId: number, factoryAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
    try {
        let createTx = await controller.createInstance(factoryAddress);
        let receipt = await createTx.wait();
        let instanceAddress = receipt.events.pop().args[1];
        let newInstance = { "challengeId": challengeId, "instanceAddress": instanceAddress, "solved": false, extra: [] };
        return newInstance;
    } catch (error: any) {
        handleError(error, displayAlert);
    }
};

const createEthernautDAOTokenInstance: any = async (controller: Contract, challengeId: number, factoryAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
    try {
        const wallet = await createRandomWallet();

        let createTx = await controller.createInstanceUsingBurnerWallet(factoryAddress, wallet.address);
        let receipt = await createTx.wait();
        let instanceAddress = receipt.events.pop().args[1];
        let newInstance = { "challengeId": challengeId, "instanceAddress": instanceAddress, "solved": false, extra: [{ "key": "Owner Address", "value": wallet.address }, { "key": "Owner Private Key", "value": wallet.privateKey }] };
        return newInstance;
    } catch (error: any) {
        handleError(error, displayAlert);
    }
};

const createVNFTInstance: any = async (controller: Contract, challengeId: number, factoryAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
    try {
        const wallet = await createRandomWallet();

        //Generate message and signature
        const message = ethers.utils.solidityKeccak256(["string"], ["random"]);
        console.log("MESSAGE: ", message);

        const messageHash = ethers.utils.arrayify(message);
        console.log("HASH: ", messageHash);

        const signature = await wallet.signMessage(messageHash);
        console.log("SIG: ", signature);
        //-----

        let createTx = await controller.createInstanceUsingBurnerWallet(factoryAddress, wallet.address, { value: ethers.utils.parseEther("0.005") });
        let receipt = await createTx.wait();
        let instanceAddress = receipt.events.pop().args[1];
        let newInstance = { "challengeId": challengeId, "instanceAddress": instanceAddress, "solved": false, extra: [] };

        //Send the needed transaction
        let ABI = ["function whitelistMint(address to, uint256 qty, bytes32 hash, bytes memory signature) external payable"];
        let iface = new ethers.utils.Interface(ABI);
        let callData = iface.encodeFunctionData("whitelistMint", [wallet.address, 2, messageHash, signature]);

        let tx = {
            to: instanceAddress,
            data: callData,
            gasPrice: ethers.utils.parseUnits('1', 'gwei'),
            gasLimit: 1000000
        };

        let signedTx = await wallet.signTransaction(tx);

        await wallet.provider.sendTransaction(signedTx);
        //-----

        return newInstance;
    } catch (error: any) {
        console.log(error);
        handleError(error, displayAlert);
    }
};

const createRandomWallet: any = async () => {
    const optimisticGoerliProvider = new ethers.providers.JsonRpcProvider(`https://opt-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`);
    return ethers.Wallet.createRandom().connect(optimisticGoerliProvider);
};

export const validateChallengeSolution: any = async (player: string, controller: Contract, challengeId: number, instanceAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
    switch (challengeId) {
        case 5: //User needs to know a wallet PK, hence we create a random wallet
            return validateEthernautDAOTokenInstance(player, controller, challengeId, instanceAddress, displayAlert);
        default:
            return validateDefaultInstance(controller, challengeId, instanceAddress, displayAlert);

    }
};

const validateDefaultInstance: any = async (controller: Contract, challengeId: number, instanceAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
    try {
        let createTx = await controller.validateSolution(instanceAddress);
        let receipt = await createTx.wait();

        if (0 < receipt.events.length) {
            displayAlert("success", "Congratulations", "You've solved this challenge. \n On to the next one!");
            return true;
        }

        displayAlert("warning", "Oops", "Looks like that's not the solution. \n Try again. You can do it!");
        return false;

    } catch (error: any) {
        handleError(error, displayAlert);
    }
};

const validateEthernautDAOTokenInstance: any = async (player: string, controller: Contract, challengeId: number, instanceAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
    try {
        let playerInfo: any[] = loadPlayerStorage(player);
        let burnerWalletAddress = playerInfo.find(progress => progress.challengeId === challengeId).extra[0].value;

        let createTx = await controller.validateSolutionUsingBurnerWallet(instanceAddress, burnerWalletAddress);
        let receipt = await createTx.wait();

        if (0 < receipt.events.length) {
            displayAlert("success", "Congratulations", "You've solved this challenge. \n On to the next one!");
            return true;
        }

        displayAlert("warning", "Oops", "Looks like that's not the solution. \n Try again. You can do it!");
        return false;

    } catch (error: any) {
        handleError(error, displayAlert);
    }
};

const handleError: any = (error: any, displayAlert: (type: string, title: string, text: string) => void) => {
    if (error.code === 4001) {
        displayAlert("danger", "Error", "Please accept the transaction");
    } else {
        displayAlert("danger", "Error", "Something went wrong. Please try again.");
    }
};

//CODE BEING SERVED FROM LOCAL http-server INSTANCE WITH CORS DISABLED. THIS IS FOR DEBUG/DEVELOPMENT ONLY
export const loadChallengeContractCode: any = (path: any, displayAlert: (type: string, title: string, text: string) => void) => {
    return new Promise((resolve, reject) => {
        try {
            fetch(`${process.env.REACT_APP_CONTRACTS_API}${path}`)
                .then(response => response.text())
                .then(text => resolve(text))
        }
        catch (error) {
            reject(error)
            displayAlert("danger", "Error", "Something went wrong. Please try again.");
        }
    })
};
