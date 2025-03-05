import { Dispatch, SetStateAction } from 'react';
import { GAME_MODES } from './game';

export interface WinScreenProps {
    show: boolean;
    setShow: Dispatch<SetStateAction<boolean>>;
    gameMode: GAME_MODES;
}