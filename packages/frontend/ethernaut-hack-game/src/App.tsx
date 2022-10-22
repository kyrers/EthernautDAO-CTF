import { JsonRpcSigner } from "@ethersproject/providers";
import { connect } from "./hooks/connect";
import { loadContract } from "./hooks/loadContract";
import { targetNetwork } from "./config/config";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Header from "./components/Header";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [userSigner, setUserSigner] = useState<JsonRpcSigner | null>();
  const [connectedWallet, setConnectedWallet] = useState("");

  //Connect user wallet
  useEffect(() => {
    async function promptConnect() {
      const { signer, signerAddress } = await connect();
      setUserSigner(signer);
      setConnectedWallet(signerAddress);
    }
    promptConnect();
  }, []);

  //Listen to wallet changes
  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });

  const controllerContract = loadContract(userSigner);

  return (
    <div className="App">
      <Header name="EthernautDAO Hacker Game" targetNetwork={targetNetwork.name} connectedWallet={connectedWallet} connect={connect} />
    </div>
  );
}

export default App;
