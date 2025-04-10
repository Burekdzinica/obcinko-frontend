import { Modal } from "react-bootstrap"
import { useEffect, useState } from "react";
import { GAME_MODES, GameModesProps } from "../../types";
import "./gameModes.css";
import { Gamepad2 } from "lucide-react";

export default function GameModesBtn({ gameMode, setGameMode }: GameModesProps) {
    const [show, setShow] = useState(false);
    const [gameModeText, setGameModeText] = useState("");
    
    useEffect(() => {
        switch (gameMode) {
            case GAME_MODES.DAILY:
                setGameModeText("Dnevno");
                break;
            
            case GAME_MODES.PRACTICE:
                setGameModeText("Vaja");
                break;
        }
    }, [gameMode]);

    const handleClose = () => setShow(false); 
    const handleShow = () => setShow(true);

    const handleGameModeSelect = (mode: GAME_MODES) => {
        setGameMode(mode);
        handleClose();
    };

    return (
        <>
            <button className="rounded active:bg-active active:scale-90 hover:bg-hover p-3 hover:scale-105" 
                onClick={handleShow}
                title="Načini igre"
            >
                <Gamepad2 className="scale-150" />
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
                    <Modal.Title className="w-full text-center !font-bold !text-primary">
                        Načini igre
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="!text-secondary text-center space-y-4">
                    <div className="mb-1">
                        <strong>Trenutni način igre: </strong>
                        <span className="!text-secondary">{gameModeText}</span>
                    </div>
                    <button
                        className={`border border-transparent p-3 rounded-full !text-primary w-full
                            ${gameMode === GAME_MODES.DAILY ? 
                                "bg-emerald-800 hover:bg-emerald-800" : 
                                "!bg-secondary hover:!bg-secondaryHover active:!bg-secondaryActive"}`}
                        onClick={() => handleGameModeSelect(GAME_MODES.DAILY)}
                        disabled={gameMode === GAME_MODES.DAILY}
                    >
                        Dnevno
                    </button>
                    <button className={`border border-transparent p-3 rounded-full !text-primary w-full
                            ${gameMode === GAME_MODES.PRACTICE ? 
                                "bg-emerald-800 hover:bg-emerald-900" : 
                                "!bg-secondary hover:!bg-secondaryHover active:!bg-secondaryActive"}`}
                        onClick={() => handleGameModeSelect(GAME_MODES.PRACTICE)}
                        disabled={gameMode === GAME_MODES.PRACTICE}
                    >
                        Vaja
                    </button>
                </Modal.Body>
            </Modal>
        </>
    )

}