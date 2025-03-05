import { Modal } from "react-bootstrap"
import { useState } from "react";
import { GAME_MODES, GameModesProps } from "../../types";
import "./gameModes.css"

export default function GameModesBtn({ setGameMode }: GameModesProps) {
    const [show, setShow] = useState(false);
    // const [gameMode, setGameMode] = useState<GAME_MODES>(GAME_MODES.DAILY);
    
    const handleClose = () => setShow(false); 
    const handleShow = () => setShow(true);

    return (
        <>
            <button className="rounded-primary active:bg-active active:scale-90 hover:bg-hover p-1 hover:scale-105" >
                <img className="w-12" 
                    onClick={handleShow}
                    src="../../res/gameModes.svg"
                    alt="GameModesBtn" 
                />
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
                    <Modal.Title className="w-100 text-center !font-bold !text-txt">
                        Načini igre
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-txt text-center flex justify-evenly">
                    <button className="border p-2 rounded-primary bg-stone-900 hover:bg-hover active:bg-active"
                        onClick={() => setGameMode(GAME_MODES.DAILY)}
                    >
                        Daily
                    </button>
                    <button className="border p-2 rounded-primary bg-stone-900 hover:bg-hover active:bg-active"
                        onClick={() => setGameMode(GAME_MODES.PRACTICE)}
                    >
                        Practice
                    </button>
                </Modal.Body>
            </Modal>
        </>
    )

}