import { useState } from "react";
import { Row, Col, Tabs, Tab } from "react-bootstrap";
import data from "../utils/challenges.json";
import BackButton from "./BackButton";

function MainPanel() {
    const emptyChallengeObject = { "id": undefined, "name": "", "factory": "", "description": "", "code": [{ "contractName": "", "code": "" }] };
    const [selectedChallenge, setSelectedChallenge] = useState(emptyChallengeObject);

    const renderChallenges = () => {
        const renderRow = (challengesRow: Array<any>, index: Number) => {
            return (
                <Row key={`challenge-row-${index}`}>
                    {
                        challengesRow.map(challenge =>
                            <Col key={`challenge-id-${challenge.id}`} className="challenge-card" sm={2} onClick={() => setSelectedChallenge(challenge)}>{challenge.name}</Col>
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
        return (
            <div>
                <div className="d-flex">
                        <BackButton callback={() => setSelectedChallenge(emptyChallengeObject)} />
                        <h1 className="margin-left-20">{selectedChallenge.name}</h1>
                </div>
                <Tabs defaultActiveKey="profile" id="code-tabs" className="mb-3">
                    {selectedChallenge.code.map(contract =>
                        <Tab eventKey={contract.contractName} title={contract.contractName}>
                            <code>
                                {contract.code}
                            </code>
                        </Tab>
                    )}
                </Tabs>
            </div >
        )
    }

    return (
        <div className="main-panel">
            {
                undefined == selectedChallenge.id ?
                    renderChallenges()
                    :
                    renderChallengeDetails()
            }
        </div>
    );
}

export default MainPanel;