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
import { addChallengeInstance, initializeStorage, loadPlayerStorage } from "./functions/playerActions";

function App() {
  const [userSigner, setUserSigner] = useState<JsonRpcSigner | null>();
  const [connectedWallet, setConnectedWallet] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [creatingInstance, setCreatingInstance] = useState(false);
  const [controller, setController] = useState();
  const [playerInfo, setPlayerInfo] = useState();

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
      loadPlayerInfo();
    }
  }, [userSigner]);

  useEffect(() => {
    console.log("PLAYER INFO", playerInfo);
    setLoadingInfo(false);
   }, [playerInfo]);


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
  };

  const loadPlayerInfo = () => {
    let playerStatus = loadPlayerStorage(connectedWallet);
    setPlayerInfo(playerStatus);
  }

  const createInstance = async (challengeId: string, factoryAddress: string) => {
    setCreatingInstance(true);
    let newInstance = await createChallengeInstance(controller, challengeId, factoryAddress);
    addChallengeInstance(connectedWallet, newInstance, loadPlayerInfo);
    setCreatingInstance(false);
  };

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
          <MainPanel creatingInstance={creatingInstance} createInstance={(_challengeId, _factoryAddress) => createInstance(_challengeId, _factoryAddress)} />
      }
    </div>
  );
}

export default App;
