import { useEffect, useState } from "react";
import { JsonRpcSigner } from "@ethersproject/providers";
import { connect } from "./functions/connect";
import { loadControllerContract } from "./functions/controllerActions";
import { createChallengeInstance, validateChallengeSolution } from "./functions/challengeActions";
import { addChallengeInstance, initializeStorage, loadPlayerStorage, setChallengeSolved, storeSelectedChallenge } from "./functions/playerActions";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { targetNetwork } from "./config/config";
import { strings } from "./utils/strings";
import Footer from "./components/Footer";
import MainPanel from "./components/MainPanel";
import ChallengeDetails from "./components/ChallengeDetails";
import Header from "./components/Header";
import LoadingScreen from "./components/LoadingScreen";
import AlertScreen from "./components/AlertScreen";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NotFound from "./components/NotFound";

function App() {
  //Placeholder for no selected challenge
  const emptyChallengeObject = { "id": "", "name": "", "factory": "", "description": "", "code": [{ "contractName": "", "filePath": "" }] };

  const [userSigner, setUserSigner] = useState<JsonRpcSigner | null>();
  const [connectedWallet, setConnectedWallet] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingCode, setLoadingCode] = useState(false);
  const [updatingInstance, setUpdatingInstance] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertText, setAlertText] = useState("");
  const [controller, setController] = useState();
  const [playerInfo, setPlayerInfo] = useState<any[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState(emptyChallengeObject);

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
    const { playerStatus, sessionStatus } = loadPlayerStorage(connectedWallet);

    setPlayerInfo(playerStatus);

    if (null !== sessionStatus && "" !== sessionStatus.id) {
      setLoadingCode(true);
      setSelectedChallenge(sessionStatus);
    }
  }

  const displayAlert = (type: string, title: string, text: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertText(text);
    setShowAlert(true);
  }

  const createInstance = async (challengeId: string, factoryAddress: string) => {
    setUpdatingInstance(true);
    let newInstance = await createChallengeInstance(controller, challengeId, factoryAddress, displayAlert);
    addChallengeInstance(connectedWallet, newInstance, loadPlayerInfo);
    setUpdatingInstance(false);
  };

  const validateSolution = async (challengeId: string, instanceAddress: string) => {
    setUpdatingInstance(true);

    let solved = await validateChallengeSolution(controller, challengeId, instanceAddress, displayAlert);
    if (solved) {
      setChallengeSolved(connectedWallet, instanceAddress, loadPlayerInfo);
    }

    setUpdatingInstance(false);
  };

  const handleSelectedChallenge = (challenge: any) => {
    setLoadingCode(true);
    storeSelectedChallenge(challenge);
    setSelectedChallenge(challenge);
  };

  /*------------------------------------------------------------
                                 RENDER
  --------------------------------------------------------------*/
  return (
    <div className="App">
      <BrowserRouter>
        <Header targetNetwork={targetNetwork} connectedWallet={connectedWallet} connect={connect} />

        <LoadingScreen show={loadingInfo || updatingInstance || loadingCode} />

        <AlertScreen show={showAlert} type={alertType} title={alertTitle} text={alertText} setShow={setShowAlert} />

        <Routes>

          <Route path="/" element={
            <MainPanel
              playerInfo={playerInfo}
              allowClicks={!loadingInfo && !updatingInstance && !loadingCode}
              handleSelectedChallenge={handleSelectedChallenge} />
          } />

          <Route path={`/challenge/${selectedChallenge.name}`} element={
            <ChallengeDetails
              selectedChallenge={selectedChallenge}
              playerInfo={playerInfo}
              loadingInfo={loadingInfo}
              updatingInstance={updatingInstance}
              loadingCode={loadingCode}
              setSelectedChallenge={setSelectedChallenge}
              setLoadingCode={setLoadingCode}
              createInstance={createInstance}
              validateSolution={validateSolution}
              displayAlert={displayAlert} />
          } />

          <Route path="*" element={<NotFound />} />

        </Routes>

        <Footer footerText={strings.footerText} />
      </BrowserRouter>

    </div>
  );
}

export default App;
