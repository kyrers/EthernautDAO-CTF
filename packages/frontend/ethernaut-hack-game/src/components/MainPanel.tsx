import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { levels } from "../utils/levels";

function MainPanel() {
    const [selectedLevel, setSelectedLevel] = useState();

    const renderChallenges = () => {
        const renderRow = (levelsRow: Array<any>) => {
            return (
                <Row>
                    {
                        levelsRow.map((level) => {
                            return (
                                <Col className="challenge-card" sm={2}>{level.name}</Col>
                            );
                        }
                        )
                    }
                </Row>
            )
        }

        return (
            levels.map(levelsRow => renderRow(levelsRow))
        );
    }

    return (
        <div className="main-panel">
            {renderChallenges()}
        </div>
    );
}

export default MainPanel;