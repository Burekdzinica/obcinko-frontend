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
            {/* <button onClick={handleShow} >
            </button> */}

            <div id='stats-btn' onClick={handleShow}>
                <img id='logo' src='res/stats2.svg' alt='stats' />
            </div>
      
            <Modal data-bs-theme="dark" className='stats-modal' show={show} onHide={handleClose} centered >
                <Modal.Header closeButton data-bs-theme="dark">
                    <Modal.Title>Statistika</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        Igrane igre <br/> <span className="stats-atr">{stats?.playedGames}</span>
                    </div>
                    <div>
                        Zmage <br/> <span className="stats-atr">{stats?.wins}</span>
                    </div>
                    <div>
                        Zmage % <br/> <span className="stats-atr">{stats?.winProcentile}%</span>
                    </div>
                    <div>
                        Zaporednih zmag <br/> <span className="stats-atr">{stats?.streak}</span>
                    </div>
                    <div>
                        Najvecje zaporedje zmag <br/> <span className="stats-atr">{stats?.maxStreak}</span>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}