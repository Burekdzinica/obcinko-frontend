import { GAME_MODES } from "./game";

export interface GameModesProps {
    setGameMode: (mode: GAME_MODES) => void;
}