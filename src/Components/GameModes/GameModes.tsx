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
            <button className="rounded active:bg-primaryActive active:scale-90 hover:bg-primaryHover p-3 hover:scale-105" 
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
                        <h3 className="p-0 m-0">
                            Načini igranja
                        </h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="!text-secondary text-center space-y-4">
                    <div className="mb-1">
                        <span>Trenutni način igre: </span> 
                        <strong className="!text-primary">{gameModeText}</strong>
                    </div>
                    <button
                        className={`border border-transparent p-3 rounded-full !text-primary w-full
                            ${gameMode === GAME_MODES.DAILY ? 
                                "bg-btnSelected" : 
                                "!bg-secondary hover:!bg-secondaryHover active:!bg-secondaryActive"}`}
                        onClick={() => handleGameModeSelect(GAME_MODES.DAILY)}
                        disabled={gameMode === GAME_MODES.DAILY}
                    >
                        Dnevno
                    </button>
                    <button className={`border border-transparent p-3 rounded-full !text-primary w-full
                            ${gameMode === GAME_MODES.PRACTICE ? 
                                "bg-btnSelected" : 
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