import './stats.css';

import { useState } from 'react';
import { Modal } from 'react-bootstrap';

export default function Stats() {
    const [show, setShow] = useState(false);

    function handleClose() {
        setShow(false);
    }

    function handleShow() {
        setShow(true);
    }

    return (
        <>
            <button onClick={handleShow} >
                <img id='logo' src='res/stats.svg' alt='stats' />
            </button>
      
            <Modal data-bs-theme="dark" className='stats-modal' show={show} onHide={handleClose} centered >
                <Modal.Header closeButton data-bs-theme="dark">
                    <Modal.Title>Stats</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    PlayedGames: 3
                </Modal.Body>
            </Modal>
        </>
    );
}