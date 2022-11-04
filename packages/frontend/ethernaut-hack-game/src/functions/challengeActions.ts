import { Contract } from "ethers";

export const createChallengeInstance: any = async (controller: Contract, instanceAddress: string) => {
    try {
        let createTx = await controller.createInstance(instanceAddress);
        await createTx.wait();
    } catch (error: any) {
        if (error.code === 4001) {
            alert("Please accept the transaction.");
        }
    }
};

//CODE BEING SERVED FROM LOCAL http-server INSTANCE WITH CORS DISABLED. THIS IS FOR DEBUG/DEVELOPMENT ONLY
export const loadChallengeContractCode: any = (path: any) => {
    return new Promise((resolve, reject) => {
        try {
            fetch(`${process.env.REACT_APP_CONTRACTS_API}${path}`)
                .then(response => response.text())
                .then(text => resolve(text))
        }
        catch (error) {
            console.log(`ERROR LOADING FILE:`, error)
            reject(error)
        }
    })
}