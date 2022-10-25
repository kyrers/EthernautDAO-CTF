import { Row, Col } from "react-bootstrap";

function MainPanel() {
    return (
        <Row className="main-panel">
            <Col sm={4} className="challenge-card">Challenge 1</Col>
            <Col sm={4} className="challenge-card">Challenge 2</Col>
            <Col sm={4} className="challenge-card">Challenge 3</Col>
        </Row >
    );
}

export default MainPanel;