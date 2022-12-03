import { Contract, ethers } from "ethers";
import { loadPlayerStorage } from "./playerActions";

export const createChallengeInstance: any = async (controller: Contract, challengeId: number, factoryAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
    if (5 === challengeId) { //User needs to know a wallet PK, hence we create a random wallet
        return createBurnerWalletInstance(controller, challengeId, factoryAddress, displayAlert);
    } else {
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

const createBurnerWalletInstance: any = async (controller: Contract, challengeId: number, factoryAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
    try {
        const optimisticGoerliProvider = new ethers.providers.JsonRpcProvider(`https://opt-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`);
        const wallet = ethers.Wallet.createRandom().connect(optimisticGoerliProvider);

        let createTx = await controller.createInstanceUsingBurnerWallet(factoryAddress, wallet.address);
        let receipt = await createTx.wait();
        let instanceAddress = receipt.events.pop().args[1];
        let newInstance = { "challengeId": challengeId, "instanceAddress": instanceAddress, "solved": false, extra: [{ "key": "Owner Address", "value": wallet.address }, { "key": "Owner Private Key", "value": wallet.privateKey }] };
        return newInstance;
    } catch (error: any) {
        handleError(error, displayAlert);
    }
};

export const validateChallengeSolution: any = async (player: string, controller: Contract, challengeId: number, instanceAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
    if (5 === challengeId) { //User needs to know a wallet PK, hence we create a random wallet
        return validateBurnerWalletInstance(player, controller, challengeId, instanceAddress, displayAlert);
    } else {
        return validateDefaultInstance(controller, challengeId, instanceAddress, displayAlert);
    }
};

const validateDefaultInstance: any =  async (controller: Contract, challengeId: number, instanceAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
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

const validateBurnerWalletInstance: any = async (player: string, controller: Contract, challengeId: number, instanceAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
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
