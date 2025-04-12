import './loseScreen.css';
import { GAME_MODES, LoseScreenProps } from '../../types';
import { Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';

export default function LoseScreen({ obcina, show, setShow, gameMode }: LoseScreenProps) {
    const [text, setText] = useState("");

    useEffect(() => {
        switch (gameMode) {
            case GAME_MODES.DAILY:
                setText("Igro lahko nadaljujete naslednji dan.");
                break;

            case GAME_MODES.PRACTICE:
                setText("Poskusite ponovno");
                break;
        }
    }, [gameMode])


    return (
        <Modal className='lose-modal text-center animate-fadeIn !text-primary' 
            data-bs-theme="dark" 
            centered 
            show={show}
            onHide={() => setShow(false)}
        >
            <Modal.Header className='!block'
                onHide={() => setShow(false)}
                closeButton
            >
                <Modal.Title>
                    <h5 className='font-semibold text-red-600 m-0' >Konec igre</h5> 
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className='text-amber-500'>Pravilna občina: <span className='font-semibold'>{ obcina }</span></h5>
                <span className='italic !text-secondary'>{text}</span>
            </Modal.Body>
        </Modal>
    )
}