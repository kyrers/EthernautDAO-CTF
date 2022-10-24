import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";
import { strings } from "../utils/strings";

function HelpModal() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <InfoCircle className="info-button" color="darkgray" onClick={handleShow} />
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>{strings.helpTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="white-space-break-spaces">{strings.helpText}</Modal.Body>
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