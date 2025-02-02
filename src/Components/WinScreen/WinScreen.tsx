import './winScreen.css';

import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';

import launchConfetti from './confetti/confetti';

export default function WinScreen() {
    useEffect(() => {
        launchConfetti();
    }, []);

    return (
        <Modal className='win-modal' show centered >
            <Modal.Header>
                <Modal.Title>Čestitke!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Uspešno ste ugotovili občino</h5> 
                Igro lahko nadaljujete naslednji dan.
            </Modal.Body>
        </Modal>
    )
}