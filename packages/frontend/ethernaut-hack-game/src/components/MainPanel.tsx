import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import data from "../utils/challenges.json";

type FunctionProps = {
    playerInfo: any[];
    allowClicks: boolean;
    handleSelectedChallenge: (challenge: any) => void;
};

function MainPanel({ playerInfo, allowClicks, handleSelectedChallenge }: FunctionProps) {
    const navigate = useNavigate();

    /*------------------------------------------------------------
                                 FUNCTIONS
    --------------------------------------------------------------*/
    const handleColClick = (challenge: any) => {
        handleSelectedChallenge(challenge);
        navigate(`challenge/${challenge.name}`);
    }

    const hasSolvedChallenge = (challengeId: number) => {
        if (null === playerInfo) {
            return false;
        }

        let challengeStatus = playerInfo.find(progress => progress.challengeId === challengeId);
        return undefined !== challengeStatus && challengeStatus.solved
    }


    /*------------------------------------------------------------
                                 RENDER
    --------------------------------------------------------------*/
    const renderChallenges = () => {
        const getCategory = (index: Number) => {
            switch (index) {
                case 1:
                    return "Medium";
                case 2:
                    return "Hard";
                default:
                    return "Easy";
            };
        }
        const splitRowIntoChunks = (row: Array<any>, chunkSize: number) => {
            let sortedCategory = [];
            for (let i = 0; i < row.length; i += chunkSize) {
                const chunk = row.slice(i, i + chunkSize);

                //Fill remaining positions so it's easier to position correctly
                const diff = chunkSize - chunk.length;
                for (let x = 0; x < diff; x++) {
                    chunk.push(null);
                }

                sortedCategory.push(chunk);
            }

            return sortedCategory;
        };

        const renderChallengeCol = (category: string, challenge: any, index: Number) => {
            if (null === challenge) {
                return (<Col key={`${category}-visual-helper-${index}`} sm={2} />);
            }

            return (
                <Col key={`${category}-challenge-id-${challenge.id}`} sm={2}
                    className={`challenge-card ${hasSolvedChallenge(challenge.id) ? "solved-background" : "unsolved-background"} ${allowClicks ? "" : "pointer-events-none"}`}
                    onClick={() => handleColClick(challenge)}>
                    <span>{challenge.name}</span>
                </Col>
            );
        }

        const renderRow = (challengesCategory: Array<any>, index: Number) => {
            let category = getCategory(index);
            let sortedCategory = splitRowIntoChunks(challengesCategory, 4);

            return (
                <div key={`${category}`}>
                    <h1 className="challenge-category-header">
                        <u>{category}</u>
                    </h1>

                    {
                        sortedCategory.map((challengesRow, index) => {
                            return (
                                <Row key={`${category}-challenge-row-${index}`}>
                                    {
                                        challengesRow.map((challenge, index) =>
                                            renderChallengeCol(category, challenge, index)
                                        )
                                    }
                                </Row>
                            );
                        })
                    }
                </div>
            );
        };

        return (
            data.challenges.map((challengesCategory, index) => renderRow(challengesCategory, index))
        );
    }

    return (
        <div className="main-panel">
            {renderChallenges()}
        </div>
    );
}

export default MainPanel;
