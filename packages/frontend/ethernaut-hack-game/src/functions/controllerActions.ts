import { Contract } from "ethers";
import { contractAddress } from '../config/config';
import ControllerContractArtifact from "../artifacts/contracts/Controller.sol/Controller.json";
import data from "../utils/challenges.json";

export const loadControllerContract: any = (signer: any) => {
    return new Contract(contractAddress, ControllerContractArtifact.abi, signer);
}

export const loadExistingChallengeInstances: any = async (controllerContract: Contract) => {
    let challengeInstances: any[] = [];
    let promises: any[] = [];

    data.challenges.forEach(challengeRow => {
        challengeRow.forEach(challenge => {
            if (challenge.factory != "") {
                promises.push(loadChallengeInstances(controllerContract, challenge.factory).then(result => challengeInstances.push({ "challenge": challenge.name, "instances": result })));
            }
        });
    });

    await Promise.all(promises);

    return challengeInstances;
};

const loadChallengeInstances = async (controller: Contract, address: string) => {
    let result = [];
    let instances = await controller.challengeInstances(address);
    for (let i = 0; i < instances.length; i = i + 3) {
        result.push({ "player": instances[i + 1], "solved": instances[i + 2] });
    }

    return result;
}