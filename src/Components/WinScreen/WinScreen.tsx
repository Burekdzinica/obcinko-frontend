import './winScreen.css';

import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';

import launchConfetti from './confetti/confetti';

// https://www.npmjs.com/package/js-confetti

export default function WinScreen() {
    useEffect(() => {
        launchConfetti();
    }, []);

    return (
        <Modal className='win-modal' show > {/* Centered?? */}
            <Modal.Header>
                <Modal.Title>Bravo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Uspešno ste ugotovili občino</h5> 
                Igro lahko nadaljujete naslednji dan.
            </Modal.Body>
        </Modal>
    )
}