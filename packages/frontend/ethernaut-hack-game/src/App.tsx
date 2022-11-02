import { JsonRpcSigner } from "@ethersproject/providers";
import { connect } from "./functions/connect";
import { loadControllerContractInfo } from "./functions/loadControllerContractInfo";
import { targetNetwork } from "./config/config";
import { useEffect, useState } from "react";
import { strings } from "./utils/strings";
import Header from "./components/Header";
import MainPanel from "./components/MainPanel";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";

function App() {
  const [userSigner, setUserSigner] = useState<JsonRpcSigner | null>();
  const [connectedWallet, setConnectedWallet] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [controller, setController] = useState();
  const [challengeInstances, setChallengeInstances] = useState()

  //Connect user wallet
  useEffect(() => {
    const loadInfo = async (signer: JsonRpcSigner | null) => {
      const { controllerContract, challengeInstances } = await loadControllerContractInfo(signer);
      setController(controllerContract);
      setChallengeInstances(challengeInstances);
      setLoadingInfo(false);
    }

    const promptConnect = async () => {
      const { signer, signerAddress } = await connect();
      setUserSigner(signer);
      setConnectedWallet(signerAddress);
      loadInfo(signer);
    }

    promptConnect();
  }, []);

  //Listen to wallet/network changes
  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });

  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });

  return (
    <div className="App">
      <Header name={strings.title} targetNetwork={targetNetwork.name} connectedWallet={connectedWallet} connect={connect} />
      {
        loadingInfo ?
          <Spinner animation="border" role="status" />
          :
          <MainPanel />
      }
    </div>
  );
}

export default App;
