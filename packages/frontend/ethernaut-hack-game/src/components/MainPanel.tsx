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

    const hasSolvedChallenge = (challengeId: string) => {
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
        const renderRow = (challengesRow: Array<any>, index: Number) => {
            return (
                <Row key={`challenge-row-${index}`}>
                    {
                        challengesRow.map(challenge =>
                            <Col key={`challenge-id-${challenge.id}`} sm={2}
                                className={`challenge-card ${hasSolvedChallenge(challenge.id) ? "solved-background" : "unsolved-background"} ${allowClicks ? "" : "pointer-events-none"}`}
                                onClick={() => handleColClick(challenge)}>

                                <span>{challenge.name}</span>

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

    return (
        <div className="main-panel">
            {renderChallenges()}
        </div>
    );
}

export default MainPanel;
