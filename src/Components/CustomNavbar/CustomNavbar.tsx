import Statistics from '../Statistics/Statistics';
import GameModesBtn from '../GameModes/GameModes';
import { Navbar } from 'react-bootstrap';
import { GameModesProps } from '../../types';
import Help from '../Help/Help';

export default function CustomNavbar({ gameMode, setGameMode }: GameModesProps) {
    return (
        <Navbar data-bs-theme="dark" className='shadow-md mb-4 bg-navbar !pl-5 !p-0.5 h-16'>
            <Navbar.Brand>
                <img className='w-14' 
                    src='res/logo.svg' 
                    alt='Logo' 
                />
            </Navbar.Brand>
            <Navbar.Brand className='p-0 font-semibold text-txt !text-4xl'>
                Občinko
            </Navbar.Brand>            
            <Navbar.Brand className='flex ms-auto gap-2'>
                <Help />
                <GameModesBtn gameMode={gameMode} setGameMode={setGameMode} />
                <Statistics />
            </Navbar.Brand>
        </Navbar>
    );
}