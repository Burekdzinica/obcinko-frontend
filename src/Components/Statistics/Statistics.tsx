import './statistics.css';

import { Stats } from "../../types/index";
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ChartNoAxesColumnIncreasing } from "lucide-react";


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
            <div className='rounded active:bg-primaryActive active:scale-90 hover:bg-primaryHover p-3 hover:scale-105 cursor-pointer' 
                onClick={handleShow}
                title='Statistika'
            >
                <ChartNoAxesColumnIncreasing className='scale-150' />
            </div>
      
            <Modal className='stats-modal
                !text-primary text-center' 
                data-bs-theme="dark"
                show={show} 
                onHide={handleClose} 
                centered 
            >
                <Modal.Header className='p-2 relative' 
                    closeButton 
                    data-bs-theme="dark"
                >
                    <Modal.Title className='!font-bold !text-[2em] !text-transparent !bg-clip-text tracking-wider grow 
                        bg-gradient-to-r from-yellow-400 via-lime-500 to-green-600'>
                        Statistika
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='flex flex-col gap-2.5 text-lg p-4'>
                    <div className='!bg-secondary p-2 rounded duration-200 ease-in-out hover:shadow-[0_0_10px_rgba(0,255,100,0.3)]'>
                        Igrane igre <br/> <span className="text-green-500">{stats?.playedGames}</span>
                    </div>
                    <div className='!bg-secondary p-2 rounded transition-shadow duration-200 ease-in-out hover:shadow-[0_0_10px_rgba(0,255,100,0.3)]'>
                        Zmage <br/> <span className="text-green-500">{stats?.wins}</span>
                    </div>
                    <div className='!bg-secondary p-2 rounded transition-shadow duration-200 ease-in-out hover:shadow-[0_0_10px_rgba(0,255,100,0.3)]'>
                        Zmage % <br/> <span className="text-green-500">{stats?.winProcentile}%</span>
                    </div>
                    <div className='!bg-secondary p-2 rounded transition-shadow duration-200 ease-in-out hover:shadow-[0_0_10px_rgba(0,255,100,0.3)]'>
                        Zaporednih zmag <br/> <span className="text-green-500">{stats?.streak}</span>
                    </div>
                    <div className='!bg-secondary p-2 rounded transition-shadow duration-200 ease-in-out hover:shadow-[0_0_10px_rgba(0,255,100,0.3)]'>
                        Največje zaporedje zmag <br/> <span className="text-green-500">{stats?.maxStreak}</span>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}