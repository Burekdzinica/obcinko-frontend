import { GAME_MODES } from "./game";

export interface GameModesProps {
    gameMode: GAME_MODES;
    setGameMode: (mode: GAME_MODES) => void;
}