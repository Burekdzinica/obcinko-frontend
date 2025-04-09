import { Modal } from "react-bootstrap"
import { useState } from "react";
import { CircleHelp } from "lucide-react";

export default function Help() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false); 
    const handleShow = () => setShow(true);


    return (
        <>
            <button className="rounded active:bg-active active:scale-90 hover:bg-hover p-3 hover:scale-105" 
                onClick={handleShow}
                title="Pomoč"
            >
                <CircleHelp className="scale-150" />
            </button> 

            <Modal className="gameModes-modal" 
                data-bs-theme="dark"
                show={show}
                onHide={handleClose}
                centered
            >
                <Modal.Header 
                    closeButton 
                    data-bs-theme="dark"
                >
                    <Modal.Title className="w-full text-center !font-bold !text-txt">
                        Kako igrati
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-white text-center space-y-4">
                <div className="space-y-4">
                        <p className="text-center font-bold text-lg">Odkrijte dnevno občino Slovenije!</p>
                        
                        <div className="border-b border-gray-600 pb-3">
                            <p className="font-semibold">Cilj igre:</p>
                            <p>Vsak dan je na voljo nova občina, ki jo morate ugotoviti v največ 5 poskusih.</p>
                        </div>
                        
                        <div className="border-b border-gray-600 pb-3 text-center">
                            <p className="font-semibold">Kako igrati:</p>
                            <ul className="list-decimal text-left space-y-2">
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