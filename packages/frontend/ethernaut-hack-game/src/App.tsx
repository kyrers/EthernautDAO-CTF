import { JsonRpcSigner } from "@ethersproject/providers";
import { connect } from "./functions/connect";
import { loadControllerContract } from "./functions/controllerActions";
import { targetNetwork } from "./config/config";
import { useEffect, useState } from "react";
import { strings } from "./utils/strings";
import Header from "./components/Header";
import MainPanel from "./components/MainPanel";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createChallengeInstance, validateChallengeSolution } from "./functions/challengeActions";
import { addChallengeInstance, initializeStorage, loadPlayerStorage, setChallengeSolved } from "./functions/playerActions";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [userSigner, setUserSigner] = useState<JsonRpcSigner | null>();
  const [connectedWallet, setConnectedWallet] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingCode, setLoadingCode] = useState(true);
  const [updatingInstance, setUpdatingInstance] = useState(false);
  const [controller, setController] = useState();
  const [playerInfo, setPlayerInfo] = useState<any[]>([]);

  /*------------------------------------------------------------
                               HOOKS
  --------------------------------------------------------------*/
  //Connect user wallet & load contract info
  useEffect(() => {
    const promptConnect = async () => {
      const { signer, signerAddress } = await connect();
      setUserSigner(signer);
      setConnectedWallet(signerAddress);
    }

    promptConnect();
  }, []);

  useEffect(() => {
    if (undefined !== userSigner) {
      initializeStorage(connectedWallet);
      loadContract();
      loadPlayerInfo();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSigner]);

  useEffect(() => {
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
    setUpdatingInstance(true);
    let newInstance = await createChallengeInstance(controller, challengeId, factoryAddress);
    addChallengeInstance(connectedWallet, newInstance, loadPlayerInfo);
    setUpdatingInstance(false);
  };

  const validateSolution = async (challengeId: string, instanceAddress: string) => {
    setUpdatingInstance(true);

    let solved = await validateChallengeSolution(controller, challengeId, instanceAddress);
    if (solved) {
      setChallengeSolved(connectedWallet, instanceAddress, loadPlayerInfo);
    }

    setUpdatingInstance(false);
  };

  /*------------------------------------------------------------
                                 RENDER
  --------------------------------------------------------------*/
  return (
    <div className="App">
      <Header name={strings.title} targetNetwork={targetNetwork} connectedWallet={connectedWallet} connect={connect} />

      <LoadingScreen show={loadingInfo || updatingInstance || loadingCode} />

      <MainPanel
        playerInfo={playerInfo}
        updatingInstance={updatingInstance}
        loadingCode={loadingCode}
        allowClicks={!loadingInfo && !updatingInstance && !loadingCode}
        setLoadingCode={setLoadingCode}
        createInstance={createInstance}
        validateSolution={validateSolution} />
    </div>
  );
}

export default App;
