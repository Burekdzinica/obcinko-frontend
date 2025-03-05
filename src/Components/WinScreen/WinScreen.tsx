import './winScreen.css';

import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';

import launchConfetti from './confetti/confetti';

export default function WinScreen() {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false); 

    useEffect(() => {
        launchConfetti();
    }, []);

    return (
        <Modal className='win-modal bg-backdropDim z-999 text-center text-txt animate-fadeIn' 
            data-bs-theme="dark"  
            show={show} 
            centered 
            onHide={handleClose}
        >
            <Modal.Header className='!block'
                onHide={handleClose}
                closeButton
            >
                <Modal.Title>Čestitke!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className='font-bold text-winGreen'>Uspešno ste ugotovili občino</h5> 
                Igro lahko nadaljujete naslednji dan.
            </Modal.Body>
        </Modal>
    )
}