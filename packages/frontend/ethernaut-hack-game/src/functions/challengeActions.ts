import { Contract } from "ethers";

export const createChallengeInstance: any = async (controller: Contract, challengeId: string, factoryAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
    try {
        let createTx = await controller.createInstance(factoryAddress);
        let receipt = await createTx.wait();
        let newInstance = { "challengeId": challengeId, "instanceAddress": receipt.events[0].args[1], "solved": false };
        return newInstance;
    } catch (error: any) {
        if (error.code === 4001) {
            displayAlert("danger", "Error", "Please accept the transaction");
        } else {
            displayAlert("danger", "Error", "Something went wrong. Please try again.");
        }
    }
};

export const validateChallengeSolution: any = async (controller: Contract, challengeId: string, instanceAddress: string, displayAlert: (type: string, title: string, text: string) => void) => {
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
        if (error.code === 4001) {
            displayAlert("danger", "Error", "Please accept the transaction");
        } else {
            displayAlert("danger", "Error", "Something went wrong. Please try again.");
        }
    }
}

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
