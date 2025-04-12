import './winScreen.css';

import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { WinScreenProps, GAME_MODES } from '../../types';
import { Trophy } from 'lucide-react';

import launchConfetti from './confetti/confetti';

export default function WinScreen({ show, setShow, gameMode }: WinScreenProps) {
    const [text, setText] = useState("");
    
        useEffect(() => {
            switch (gameMode) {
                case GAME_MODES.DAILY:
                    setText("Nova uganka vas čaka jutri ob polnoči. Se vidimo!");
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
        <Modal className='win-modal z-999 text-center !text-primary animate-fadeIn' 
            data-bs-theme="dark"  
            show={show} 
            centered 
            onHide={() => setShow(false)}
        >
            <Modal.Header className='!block'
                onHide={() => setShow(false)}
                closeButton
            >
                <Modal.Title className='flex items-center justify-center gap-2'>
                    <Trophy className='text-amber-500' />
                    <h3 className='text-amber-600 m-0 font-semibold'>Čestitke!</h3>
                    <Trophy className='text-amber-500' />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className='font-bold text-lime-600'>Uspešno ste ugotovili občino</h5> 
                <span className='italic !text-secondary'>{text}</span>
            </Modal.Body>
        </Modal>
    )
}