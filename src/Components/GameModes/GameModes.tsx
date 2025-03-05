import { Modal } from "react-bootstrap"
import { useState } from "react";
import { GAME_MODES, GameModesProps } from "../../types";
import "./gameModes.css"

export default function GameModesBtn({ setGameMode }: GameModesProps) {
    const [show, setShow] = useState(false);
    // const [gameMode, setGameMode] = useState<GAME_MODES>(GAME_MODES.DAILY);
    
    const handleClose = () => setShow(false); 
    const handleShow = () => setShow(true);

    const handleGameModeSelect = (mode: GAME_MODES) => {
        setGameMode(mode);
        handleClose();
    };

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
                    <Modal.Title className="w-full text-center !font-bold !text-txt">
                        Načini igre
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-white text-center space-y-4">
                    <button
                        className="border border-transparent p-3 rounded-full bg-stone-800 hover:bg-hover active:bg-active text-white w-full transition-all"
                        onClick={() => handleGameModeSelect(GAME_MODES.DAILY)}
                    >
                        Dnevno
                    </button>
                    <button
                        className="border border-transparent p-3 rounded-full bg-stone-800 hover:bg-hover active:bg-active text-white w-full transition-all"
                        onClick={() => handleGameModeSelect(GAME_MODES.PRACTICE)}
                    >
                        Vaja
                    </button>
                </Modal.Body>
            </Modal>
        </>
    )

}