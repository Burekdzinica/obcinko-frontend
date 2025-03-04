import './loseScreen.css';

import { Modal } from 'react-bootstrap';

export default function LoseScreen({ obcina }: {obcina: string}) {
    return (
        <Modal className='lose-modal bg-backdropDim text-center animate-fadeIn text-txt' 
            data-bs-theme="dark" 
            show centered 
        >
            <Modal.Header className='!block'>
                <Modal.Title>Pravilna občina: { obcina } </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className='font-bold text-red-700' >Konec igre</h5> 
                Igro lahko nadaljujete naslednji dan.
            </Modal.Body>
        </Modal>
    )
}