import { Contract } from "ethers";

export const createChallengeInstance: any = async (controller: Contract, instanceAddress: string) => {
    try {
        let createTx = await controller.createInstance(instanceAddress);
        await createTx.wait();
    } catch (error: any) {
        if(error.code === 4001) {
            alert("Please accept the transaction.");
        }
    }
};