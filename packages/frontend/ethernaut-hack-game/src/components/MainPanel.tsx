import { JSXElementConstructor, useEffect, useState, FC, ReactElement, ReactNode } from "react";
import { Row, Col } from "react-bootstrap";
import { levels } from "../utils/levels";

function MainPanel() {
    const [levelsDictionary, setLevelsDictionary] = useState(new Map());
    const [selectedLevel, setSelectedLevel] = useState();

    useEffect(() => {
        let auxDictionary = new Map<Number, Array<any>>();

        for (let i = 0; i < levels.length; i += 6) {
            const chunk = levels.slice(i, i + 6);
            auxDictionary.set(i, chunk);
        }

        setLevelsDictionary(auxDictionary);
    }, []);

    const renderChallenges = () => {

        console.log(levelsDictionary);

        const renderRow = (levels: Array<any>) => {
            console.log(levels);
            return (
                <Row className="main-panel">
                    {
                        levels.map((level) =>
                            <Col className="challenge-card" sm={2}>{level.name}</Col>
                        )
                    }
                </Row>
            )
        }

        return (
            <div>
                {Array.from(levelsDictionary).map((dictValues) => renderRow(dictValues[1]))}
            </div>
        );
    }

    return (
        <div>
            {renderChallenges()}
        </div>
    );
}

export default MainPanel;