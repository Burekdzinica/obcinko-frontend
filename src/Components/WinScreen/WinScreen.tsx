import './winScreen.css';

import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';

import launchConfetti from './confetti/confetti';

export default function WinScreen() {
    useEffect(() => {
        launchConfetti();
    }, []);

    return (
        <Modal data-bs-theme="dark" className='win-modal bg-backdropDim z-999 text-center text-txt animate-fadeIn' show centered >
            <Modal.Header className='block'>
                <Modal.Title>Čestitke!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className='font-bold text-winGreen'>Uspešno ste ugotovili občino</h5> 
                Igro lahko nadaljujete naslednji dan.
            </Modal.Body>
        </Modal>
    )
}