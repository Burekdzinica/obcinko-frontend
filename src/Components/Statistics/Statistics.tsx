import './statistics.css';

import { Stats } from "../../types/index";
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

export default function Statistics() {
    const [show, setShow] = useState(false);
    const [stats, setStats] = useState<Stats>();

    
    const handleClose = () => setShow(false); 
    const handleShow = () => setShow(true);

    // Get stats from localStorage or create new stats
    function loadStats() {
        const savedStats = localStorage.getItem("stats");

        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
        // Need this'??
        else {
            setStats({
                playedGames: 0,
                wins: 0,
                winProcentile: 0,
                streak: 0,
                maxStreak: 0
            })
        }
    } 

    useEffect(() => {
        loadStats();
    }, [localStorage.getItem("stats")]);

    return (
        <>
            {/* Icon */ }
            <div className='rounded-primary active:bg-active active:scale-90 hover:bg-hover p-1 hover:scale-105' 
                onClick={handleShow}
            >
                {/* TODO: fit to parent inmstead of fixed width */}
                <img className='w-12' 
                    src='res/stats2.svg' 
                    alt='stats' 
                />
            </div>
      
            <Modal className='stats-modal bg-[linear-gradient(135deg,rgb(30,30,30),rgb(15,15,15))] bg-backdropDim animate-fadeIn text-txt p-modal text-center ' 
                data-bs-theme="dark"
                show={show} 
                onHide={handleClose} 
                centered 
            >
                <Modal.Header className='p-2 relative' 
                    closeButton 
                    data-bs-theme="dark"
                >
                    <Modal.Title className='!font-bold !text-[2em] !text-transparent !bg-clip-text tracking-wider grow bg-gradient-to-r from-yellow-400 via-lime-500 to-green-600'>
                        Statistika
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='flex flex-col gap-2.5 text-lg !p-[1.5em]'>
                    <div className='bg-stone-100/5 p-2 rounded-primary duration-200 ease-in-out hover:shadow-[0_0_10px_rgba(0,255,100,0.3)]'>
                        Igrane igre <br/> <span className="text-green-600">{stats?.playedGames}</span>
                    </div>
                    <div className='bg-stone-100/5 p-2 rounded-primary transition-shadow duration-200 ease-in-out hover:shadow-[0_0_10px_rgba(0,255,100,0.3)]'>
                        Zmage <br/> <span className="text-green-600">{stats?.wins}</span>
                    </div>
                    <div className='bg-stone-100/5 p-2 rounded-primary transition-shadow duration-200 ease-in-out hover:shadow-[0_0_10px_rgba(0,255,100,0.3)]'>
                        Zmage % <br/> <span className="text-green-600">{stats?.winProcentile}%</span>
                    </div>
                    <div className='bg-stone-100/5 p-2 rounded-primary transition-shadow duration-200 ease-in-out hover:shadow-[0_0_10px_rgba(0,255,100,0.3)]'>
                        Zaporednih zmag <br/> <span className="text-green-600">{stats?.streak}</span>
                    </div>
                    <div className='bg-stone-100/5 p-2 rounded-primary transition-shadow duration-200 ease-in-out hover:shadow-[0_0_10px_rgba(0,255,100,0.3)]'>
                        Najvecje zaporedje zmag <br/> <span className="text-green-600">{stats?.maxStreak}</span>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}