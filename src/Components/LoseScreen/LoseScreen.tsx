import './loseScreen.css';

import { Modal } from 'react-bootstrap';

export default function LoseScreen({ obcina }: {obcina: string}) {
    return (
        <Modal className='lose-modal' show centered >
            <Modal.Header>
                <Modal.Title>Pravilna občina: { obcina } </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Konec igre</h5> 
                Igro lahko nadaljujete naslednji dan.
            </Modal.Body>
        </Modal>
    )
}