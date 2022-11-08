import { useEffect, useState } from "react";
import { Row, Col, Tabs, Tab, Spinner, Button } from "react-bootstrap";
import { loadChallengeContractCode } from "../functions/challengeActions";
import hljs from "highlight.js/lib/core";
import data from "../utils/challenges.json";
import BackButton from "./BackButton";
import "../css/vs2015_dark.css";
import { CheckCircle, XCircle } from "react-bootstrap-icons";

type FunctionProps = {
    playerInfo: any[];
    creatingInstance: Boolean;
    createInstance: (challengeId: string, factoryAddress: string) => void;
};

function MainPanel({ playerInfo, creatingInstance, createInstance }: FunctionProps) {
    //Placeholders for no selected challenge/ no challenge player status
    const emptyChallengeObject = { "id": "", "name": "", "factory": "", "description": "", "code": [{ "contractName": "", "filePath": "" }] };
    const emptyChallengePlayerStatusObject = { "challengeId": "", "instanceAddress": "", "solved": false };

    const [selectedChallenge, setSelectedChallenge] = useState(emptyChallengeObject);
    const [loadingCode, setLoadingCode] = useState(true);
    const [selectedChallengeContractsCode, setSelectedChallengeContractsCode] = useState<any[]>([]);
    const [selectedChallengePlayerStatus, setSelectedChallengePlayerStatus] = useState(emptyChallengePlayerStatusObject);


    /*------------------------------------------------------------
                                 HOOKS
    --------------------------------------------------------------*/
    useEffect(() => {
        const loadCode = async (filePath: string) => {
            return await loadChallengeContractCode(filePath);
        };

        if ("" !== selectedChallenge.id) {
            let loadedCode: any[] = [];
            let promises: any[] = [];

            selectedChallenge.code.forEach(contract => {
                promises.push(loadCode(contract.filePath).then(result => loadedCode.push(result)));
            });

            Promise.all(promises).then(_ => {
                setSelectedChallengeContractsCode(loadedCode);
                setLoadingCode(false);
            });

        } else {
            setLoadingCode(false);
        }
    }, [selectedChallenge]);


    /*------------------------------------------------------------
                                 FUNCTIONS
    --------------------------------------------------------------*/
    const handleBackButtonClick = () => {
        setSelectedChallenge(emptyChallengeObject);
        setSelectedChallengePlayerStatus(emptyChallengePlayerStatusObject);
    }

    const handleSelectedChallenge = (challenge: any) => {
        setLoadingCode(true);
        setSelectedChallenge(challenge);
        loadPlayerChallengeProgress(challenge)
    }

    const loadPlayerChallengeProgress = (challenge: any) => {
        let challengeStatus = playerInfo.find(progress => progress.challengeId === challenge.id);
        setSelectedChallengePlayerStatus(undefined !== challengeStatus ? challengeStatus : emptyChallengePlayerStatusObject);
    }

    const hasSolvedChallenge = (challengeId: string) => {
        let challengeStatus = playerInfo.find(progress => progress.challengeId === challengeId);
        return undefined !== challengeStatus && challengeStatus.solved
    }


    /*------------------------------------------------------------
                                 RENDER
    --------------------------------------------------------------*/
    const renderChallenges = () => {
        const renderRow = (challengesRow: Array<any>, index: Number) => {
            return (
                <Row key={`challenge-row-${index}`}>
                    {
                        challengesRow.map(challenge =>
                            <Col key={`challenge-id-${challenge.id}`} className="challenge-card" sm={2} onClick={() => handleSelectedChallenge(challenge)}>
                                {challenge.name}

                                {
                                    hasSolvedChallenge(challenge.id) ?
                                        <CheckCircle className="challenge-status-icon" color="green" />
                                        :
                                        <XCircle className="challenge-status-icon" color="red" />
                        }
                            </Col>
                        )
                    }
                </Row>
            )
        }

        return (
            data.challenges.map((challengesRow, index) => renderRow(challengesRow, index))
        );
    }


    const renderChallengeDetails = () => {
        const getContractCode = (index: number) => {
            return {
                __html: hljs.highlight(selectedChallengeContractsCode[index], { language: "solidity" }).value
            }
        }

        return (
            <div>
                {
                    loadingCode || creatingInstance ?
                        <Spinner animation="border" role="status" />
                        :
                        <>
                            <div className="challenge-details-header">
                                <div className="d-inline-flex">
                                    <BackButton callback={handleBackButtonClick} />
                                    <h1 className="margin-left-20">{selectedChallenge.name}</h1>
                                </div>
                                <div className="d-inline-flex">
                                    <Button className="custom-button margin-right-10" onClick={() => createInstance(selectedChallenge.id, selectedChallenge.factory)} disabled={"" !== selectedChallengePlayerStatus.challengeId}>
                                        {
                                            <span>Create instance</span>
                                        }
                                    </Button>
                                    <Button className="custom-button" disabled={"" === selectedChallengePlayerStatus.challengeId}>
                                        {
                                            <span>Validate solution</span>
                                        }
                                    </Button>
                                </div>
                            </div>

                            <Tabs id="code-tabs" className="mb-3">
                                {
                                    selectedChallenge.code.map((contract, index) =>
                                        <Tab className="text-align-start" key={contract.contractName} eventKey={contract.contractName} title={contract.contractName}>
                                            <b className="font-size-18">Address: {"" !== selectedChallengePlayerStatus.challengeId ? selectedChallengePlayerStatus.instanceAddress : "TBD"}</b>
                                            <pre><code className="hljs" dangerouslySetInnerHTML={getContractCode(index)}></code></pre>
                                        </Tab>
                                    )
                                }
                            </Tabs>
                        </>
                }
            </div>
        )
    }

    return (
        <div className="main-panel">
            {
                "" === selectedChallenge.id ?
                    renderChallenges()
                    :
                    renderChallengeDetails()
            }
        </div>
    );
}

export default MainPanel;