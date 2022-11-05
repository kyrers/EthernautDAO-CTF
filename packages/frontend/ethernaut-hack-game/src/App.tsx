import { JsonRpcSigner } from "@ethersproject/providers";
import { connect } from "./functions/connect";
import { loadControllerContract/*, loadExistingChallengeInstances*/ } from "./functions/controllerActions";
import { targetNetwork } from "./config/config";
import { useEffect, useState } from "react";
import { strings } from "./utils/strings";
import Header from "./components/Header";
import MainPanel from "./components/MainPanel";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import { createChallengeInstance } from "./functions/challengeActions";
import { initializeStorage } from "./functions/playerActions";

function App() {
  const [userSigner, setUserSigner] = useState<JsonRpcSigner | null>();
  const [connectedWallet, setConnectedWallet] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [creatingInstance, setCreatingInstance] = useState(false);
  const [controller, setController] = useState();
  const [challengeInstances, setChallengeInstances] = useState();

  /*------------------------------------------------------------
                               HOOKS
  --------------------------------------------------------------*/
  //Connect user wallet & load contract info
  useEffect(() => {
    const promptConnect = async () => {
      const { signer, signerAddress } = await connect();
      setUserSigner(signer);
      setConnectedWallet(signerAddress);
      //loadInfo(signer);
    }

    promptConnect();
  }, []);

  useEffect(() => {
    if (userSigner !== undefined) {
      initializeStorage(connectedWallet);
      loadContract();
    }
  }, [userSigner]);

  useEffect(() => {
    if (userSigner !== undefined) {
      //loadChallengeInstances();
    }
  }, [controller]);


  /*------------------------------------------------------------
                                 FUNCTIONS
  --------------------------------------------------------------*/
  //Listen to wallet changes
  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });

  //Listen to network changes
  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
  //-------

  const loadContract = async () => {
    const contract = loadControllerContract(userSigner);
    setController(contract);
  }

  /*const loadChallengeInstances = async () => {
    const challengeInstances = await loadExistingChallengeInstances(controller);
    setChallengeInstances(challengeInstances);
    setLoadingInfo(false);
    setCreatingInstance(false);
  }*/

  const createInstance = async (instanceAddress: string) => {
    setCreatingInstance(true);
    await createChallengeInstance(controller, instanceAddress);
   // await loadChallengeInstances();
  }


  /*------------------------------------------------------------
                                 RENDER
  --------------------------------------------------------------*/
  return (
    <div className="App">
      <Header name={strings.title} targetNetwork={targetNetwork.name} connectedWallet={connectedWallet} connect={connect} />
      {
        loadingInfo ?
          <Spinner animation="border" role="status" />
          :
          <MainPanel creatingInstance={creatingInstance} createInstance={(_instanceAddress) => createInstance(_instanceAddress)} />
      }
    </div>
  );
}

export default App;
