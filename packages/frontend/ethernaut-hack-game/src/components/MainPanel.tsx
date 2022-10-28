import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { challenges } from "../utils/challenges";

function MainPanel() {
    const [selectedChallenge, setSelectedChallenge] = useState({ "id": undefined, "name": "", "factory": "", "description": "" });

    const renderChallenges = () => {
        const renderRow = (challengesRow: Array<any>, index: Number) => {
            return (
                <Row key={`challenge-row-${index}`}>
                    {
                        challengesRow.map((challenge) => {
                            return (
                                <Col key={`challenge-id-${challenge.id}`} className="challenge-card" sm={2} onClick={() => setSelectedChallenge(challenge)}>{challenge.name}</Col>
                            );
                        }
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
                {selectedChallenge.name}
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