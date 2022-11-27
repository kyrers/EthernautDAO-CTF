pragma solidity ^0.8.17;

import "../../Challenge.sol";
import "./Wallet.sol";
import "./WalletLibrary.sol";

/**
 * @author kyrers
 */
contract LightweightMultisigWalletFactory is Challenge {
    address private walletLibraryAddress;

    constructor(address _walletLibraryAddress) {
        walletLibraryAddress = _walletLibraryAddress;
    }

    function createInstance(address _player) public payable override returns (address) {
        address[] memory owners = new address[](1);
        owners[0] = address(this);
        return address(new Wallet(walletLibraryAddress, owners , 1));
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        Wallet challengeInstance = Wallet(_instance);
        return challengeInstance.isOwner(_player);
    }
}
