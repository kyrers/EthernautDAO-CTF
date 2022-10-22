import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";

function HelpModal() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const helpText =
        "1. Choose a challenge. \n\n" +
        "2. Create an instance of that challenge and solve it. \n\n" +
        "3. Validate your solution.";

    return (
        <>
            <InfoCircle className="info-button" color="darkgray" onClick={handleShow} />
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>How it works</Modal.Title>
                </Modal.Header>
                <Modal.Body className="white-space-break-spaces">{helpText}</Modal.Body>
                <Modal.Footer>
                    <Button className="custom-button" variant="secondary" onClick={handleClose}>
                        Got it
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default HelpModal;