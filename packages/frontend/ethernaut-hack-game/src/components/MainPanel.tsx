import { useEffect, useState } from "react";
import { Row, Col, Tabs, Tab, Spinner, Button } from "react-bootstrap";
import hljs from "highlight.js/lib/core";
import data from "../utils/challenges.json";
import BackButton from "./BackButton";
import loadContractCode from "../functions/loadContractCode";
import "../css/vs2015_dark.css";

function MainPanel() {
    //Placeholder for no selected challenge
    const emptyChallengeObject = { "id": undefined, "name": "", "factory": "", "description": "", "code": [{ "contractName": "", "filePath": "" }] };

    const [selectedChallenge, setSelectedChallenge] = useState(emptyChallengeObject);
    const [loadingCode, setLoadingCode] = useState(true);
    const [selectedChallengeContractsCode, setSelectedChallengeContractsCode] = useState<any[]>([]);


    /*------------------------------------------------------------
                                 HOOKS
    --------------------------------------------------------------*/
    useEffect(() => {
        const loadCode = async (filePath: string) => {
            return await loadContractCode(filePath);
        };

        if (selectedChallenge.id !== undefined) {
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
    const handleSelectedChallenge = (challenge: any) => {
        setLoadingCode(true);
        setSelectedChallenge(challenge);
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
                            <Col key={`challenge-id-${challenge.id}`} className="challenge-card" sm={2} onClick={() => handleSelectedChallenge(challenge)}>{challenge.name}</Col>
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
                    loadingCode ?
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        :
                        <>
                            <div className="challenge-details-header">
                                <div className="d-inline-flex">
                                    <BackButton callback={() => setSelectedChallenge(emptyChallengeObject)} />
                                    <h1 className="margin-left-20">{selectedChallenge.name}</h1>
                                </div>
                                <div className="d-inline-flex">
                                    <Button className="custom-button margin-right-10">
                                        {
                                            <span>Create instance</span>
                                        }
                                    </Button>
                                    <Button className="custom-button">
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
                                            <b className="font-size-18">Address: TBD</b>
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
                undefined === selectedChallenge.id ?
                    renderChallenges()
                    :
                    renderChallengeDetails()
            }
        </div>
    );
}

export default MainPanel;