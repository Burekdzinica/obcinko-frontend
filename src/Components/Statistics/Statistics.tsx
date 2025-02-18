import './statistics.css';

import { Stats } from "../../types/index";
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

export default function Statistics() {
    const [show, setShow] = useState(false);
    const [stats, setStats] = useState<Stats>();

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

    function handleClose() {
        setShow(false);
    }

    function handleShow() {
        setShow(true);
    }

    return (
        <>
            <button onClick={handleShow} >
                <img id='logo' src='res/stats.svg' alt='stats' />
            </button>
      
            <Modal data-bs-theme="dark" className='stats-modal' show={show} onHide={handleClose} centered >
                <Modal.Header closeButton data-bs-theme="dark">
                    <Modal.Title>Stats</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Played Games: {stats?.playedGames}</div>
                    <div>Wins: {stats?.wins}</div>
                    <div>Win %: {stats?.winProcentile}</div>
                    <div>Streak: {stats?.streak}</div>
                    <div>Max Streak: {stats?.maxStreak}</div>
                </Modal.Body>
            </Modal>
        </>
    );
}