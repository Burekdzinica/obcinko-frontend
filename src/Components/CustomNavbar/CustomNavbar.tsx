import Statistics from '../Statistics/Statistics';
import GameModesBtn from '../GameModes/GameModes';
import { Navbar } from 'react-bootstrap';
import { GameModesProps } from '../../types';
import Help from '../Help/Help';

export default function CustomNavbar({ gameMode, setGameMode }: GameModesProps) {
    return (
        <Navbar className='shadow-md mb-4 bg-navbar !pl-5 h-14'
            data-bs-theme="dark" 
        >
            <Navbar.Brand>
                <img className='w-14 max-sm:w-8' 
                    src='res/logo.svg' 
                    alt='Logo' 
                />
            </Navbar.Brand>
            <Navbar.Brand className='p-0 !text-primary !text-4xl max-sm:!text-2xl'>
                <h2 className='m-0'>
                    občinko
                </h2>
            </Navbar.Brand>            
            <Navbar.Brand className='flex ms-auto gap-2 max-sm:scale-75'>
                <Help />
                <GameModesBtn 
                    gameMode={gameMode} 
                    setGameMode={setGameMode} 
                />
                <Statistics />
            </Navbar.Brand>
        </Navbar>
    );
}