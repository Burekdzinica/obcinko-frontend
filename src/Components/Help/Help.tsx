import { Modal } from "react-bootstrap"
import { useState } from "react";
import { CircleHelp } from "lucide-react";

import "./help.css";


export default function Help() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false); 
    const handleShow = () => setShow(true);


    return (
        <>
            <button className="rounded active:bg-primaryActive active:scale-90 hover:bg-primaryHover p-3 hover:scale-105" 
                onClick={handleShow}
                title="Pomoč"
            >
                <CircleHelp className="scale-150" />
            </button> 

            <Modal className="help-modal"
                data-bs-theme="dark"
                show={show}
                onHide={handleClose}
                centered
            >
                <Modal.Header className="!bg-secondary"
                    closeButton 
                    data-bs-theme="dark"
                >
                    <Modal.Title className="w-full text-center !font-bold !text-primary">
                        <h4 className="p-0 m-0">Kako igrati</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-white text-center space-y-4">
                <div className="space-y-4">
                        <h4 className="text-center font-bold">Odkrijte dnevno občino Slovenije!</h4>
                        
                        <div className="border-b border-gray-600 pb-3">
                            <h5 className="font-semibold">Cilj igre:</h5>
                            <p className="!text-secondary">Vsak dan je na voljo nova občina, ki jo morate ugotoviti v največ 5 poskusih.</p>
                        </div>
                        
                        <div className="border-b border-gray-600 pb-3 text-center">
                            <h5 className="font-semibold">Kako igrati:</h5>
                            <ul className="list-decimal text-left space-y-2 !text-secondary">
                                <li>Vpišite ime občine v iskalno polje in potrdite.</li>
                                <li>Po vsakem ugibu boste prejeli razne namige.</li>
                                <li>Igra se konča, ko pravilno uganete občino ali porabite vse poskuse.</li>
                            </ul>
                        </div>
                        
                        <div>
                            <p className="text-center italic">Nova občina je na voljo vsak dan ob polnoči!</p>
                            <p className="text-center mt-3">Srečno ugibanje!</p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )

}