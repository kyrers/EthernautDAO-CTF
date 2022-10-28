import { useState } from "react";
import { Row, Col, Tabs, Tab } from "react-bootstrap";
import { challenges } from "../utils/challenges";

function MainPanel() {
    const [selectedChallenge, setSelectedChallenge] = useState({ "id": undefined, "name": "", "factory": "", "description": "", "code": [{ "contractName": "", "code": "" }] });

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
            challenges.map((challengesRow, index) => renderRow(challengesRow, index))
        );
    }

    const renderChallengeDetails = () => {
        return (
            <div>
                <h1>{selectedChallenge.name}</h1>
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