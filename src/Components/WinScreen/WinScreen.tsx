import './winScreen.css';

import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { WinScreenProps, GAME_MODES } from '../../types';

import launchConfetti from './confetti/confetti';

export default function WinScreen({ show, setShow, gameMode }: WinScreenProps) {
    const [text, setText] = useState("");
    
        useEffect(() => {
            switch (gameMode) {
                case GAME_MODES.DAILY:
                    setText("Igro lahko nadaljujete naslednji dan.");
                    break;
    
                case GAME_MODES.PRACTICE:
                    setText("Igrajte ponovno");
                    break;
            }
        }, [gameMode])

    useEffect(() => {
        launchConfetti();
    }, []);

    return (
        <Modal className='win-modal bg-backdropDim z-999 text-center text-txt animate-fadeIn' 
            data-bs-theme="dark"  
            show={show} 
            centered 
            onHide={() => setShow(false)}
        >
            <Modal.Header className='!block'
                onHide={() => setShow(false)}
                closeButton
            >
                <Modal.Title>Čestitke!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className='font-bold text-winGreen'>Uspešno ste ugotovili občino</h5> 
                {text}
            </Modal.Body>
        </Modal>
    )
}