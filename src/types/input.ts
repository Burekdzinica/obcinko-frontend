import { GameState } from "./game";

export type InputEvent = React.ChangeEvent<HTMLInputElement>;
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type ClickEvent = React.MouseEvent<HTMLElement>;
export type KeyEvent = React.KeyboardEvent<HTMLInputElement>;

export interface InputProps {
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    handleGuess: (guess: string) => void;
    numberOfGuesses: number;
    obcine: string[];
    gameState: GameState;
}