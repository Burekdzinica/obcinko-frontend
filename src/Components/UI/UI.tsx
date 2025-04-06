import './UI.css'

import CustomNavbar from '../CustomNavbar/CustomNavbar'
import Game from '../Game/Game'
import { useState } from 'react';
import { GAME_MODES } from '../../types';
// import Footer from '../Footer/Footer'

export default function UI() {
    const [gameMode, setGameMode] = useState<GAME_MODES>(GAME_MODES.DAILY);
    
    return (
        <>
            {/* <div className="container"> */}
            <CustomNavbar gameMode={gameMode} setGameMode={ setGameMode } />

            <Game gameMode={gameMode} />

            {/* <Footer /> */}
        {/* </div> */}
        </>
    )
}