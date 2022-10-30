import { ethers } from "ethers";
import { contractAddress } from '../config/config';
import ControllerContractArtifact from "../artifacts/contracts/Controller.sol/Controller.json";

export const loadContract = (signer: any) => {
    return new ethers.Contract(contractAddress, ControllerContractArtifact.abi, signer);
}