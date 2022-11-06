import { Contract } from "ethers";
import { contractAddress } from '../config/config';
import ControllerContractArtifact from "../artifacts/contracts/Controller.sol/Controller.json";

export const loadControllerContract: any = (signer: any) => {
    return new Contract(contractAddress, ControllerContractArtifact.abi, signer);
};
