import Input from "../Input/Input";
import Map from "../Map/Map";
import Region from "../Region/Region"
import WrongGuessMsg from "../WrongGuessMsg/WrongGuessMsg";
import UnknownGuessMsg from "../UnknownGuessMsg/UnknownGuessMsg";
import LoseScreen from "../LoseScreen/LoseScreen";
import WinScreen from "../WinScreen/WinScreen";

// import { writeObcineToFile } from '../../utils/utils';

import { GeoJsonProps, Features, Feature, GameState, Stats } from "../../types/index";

import './game.css'

import { useState, useEffect } from "react";
import { normalizeText, getFeatureFromNaziv } from "../../utils/utils";

// https://ipi.eprostor.gov.si/wfs-si-gurs-rpe/ogc/features/collections/SI.GURS.RPE:OBCINE/items?f=application%2Fgeo%2Bjson&limit=212

// Select random feature from json
async function fetchRandomFeature() {
    try {
        const response = await fetch('/jsons/obcine.json');
        const data: GeoJsonProps = await response.json();

        if (!data) {
            console.log("Data is empty");
            return;
        }

        let features: Features = data.features;
        let randomIndex = Math.floor(Math.random() * features.length);
        let randomFeature: Feature = features[randomIndex];

        return randomFeature;
    }
    catch (error) {
        console.error("Error loading obcine.json: ", error)
        return;
    }
}

async function fetchAllFeatures() {
    try {
        const response = await fetch('/jsons/obcine.json');
        const data: GeoJsonProps = await response.json();

        if (!data) {
            console.log("Data is empty");
            return;
        }

        let features: Features  = data.features;

        return features;
    }
    catch (error) {
        console.error("Error loading obcine.json: ", error)
        return;
    }
}

async function fetchSolution(url: string) {
    try {
        const response = await fetch(url);
        const solution = await response.json();

        return solution;
    }
    catch (error) {
        console.error("Error loading solutions.json: ", error)
        return;
    }
}

// Return list of obcine
function getObcineFromFeatures(allFeatures: Features) {
    const obcine: string[] = []; 

    allFeatures.forEach(feature => {
        if (!feature.properties) {
            console.error("Feature properties are empty");
            return;
        }
        const naziv = feature.properties.NAZIV;
        obcine.push(naziv);
    })
    
    return obcine; 
}

function isWin(guess: string, solution: string) {
    const normalizedGuess = normalizeText(guess);
    const normalizedSolution = normalizeText(solution);

    return normalizedGuess === normalizedSolution;
}

export default function Game() {
    const [inputValue, setInputValue] = useState('');
    // lmao I'm a comment 
    const [isWrongGuess, setIsWrongGuess] = useState(false);
    const [isUnknownGuess, setIsUnkownGuess] = useState(false);
    const [lastGuess, setLastGuess] = useState(""); // save guess, so it doesn't change on input change
    
    const [allFeatures, setAllFeatures] = useState<Features>();
    const [obcine, setObcine] = useState<string[]>();
   
    const [gameState, setGameState] = useState<GameState>();
    const [stats, setStats] = useState<Stats>();

    
    async function getDaily() {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0]; // yyyy-mm-dd

        const apiUrl = "http://localhost:5001/api/" + formattedDate;

        const solution = await fetchSolution(apiUrl);

        return solution;
    }

    // Daily obcina
    useEffect(() => {
        async function getFeatureFromNaziv(features: Features, naziv: string) {
            return features.find((feature) => feature.properties?.NAZIV === naziv);
        }

        async function initGame() {
            const daily = await getDaily();
            const allFeatures = await fetchAllFeatures();
    
            if (!allFeatures) {
                console.log("Data is empty");
                return;
            }
    
            setAllFeatures(allFeatures);

            const newObcine = getObcineFromFeatures(allFeatures);
            setObcine(newObcine);

            const dailyFeature = await getFeatureFromNaziv(allFeatures, daily.solution);

            if (!dailyFeature) {
                console.log("Daily feature is empty");
                return;
            }

            loadGameState(dailyFeature);
            loadStats();
        }

        initGame();
    }, []);

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
            });
        }
    } 

    // Get gameState from localStorage or create new gameState
    function loadGameState(feature: Feature) {
        const savedState = localStorage.getItem("gameState");

        if (savedState) {
            setGameState(JSON.parse(savedState));
        }
        else {
            setGameState({
                solution: feature.properties?.NAZIV,
                obcinaFeature: feature,
                numberOfGuesses: 1,
                showSatellite: false,
                win: false,
                lose: false,
                hints: {
                    outline: false,
                    region: false,
                    adjacentObcine: false,
                    map: false
                }
            });
        }
    }

    // Init game
    // Random obcina gamemode
    // useEffect(() => {
    //     async function initGame() {
    //         const allFeatures = await fetchAllFeatures();
    //         const randomFeature = await fetchRandomFeature();
    
    //         if (!randomFeature) {
    //             console.log("Random feature is empty");
    //             return;
    //         }

    //         if (!allFeatures) {
    //             console.log("All features is empty");
    //             return;
    //         }

    //         setAllFeatures(allFeatures);

    //         const newObcine = getObcineFromFeatures(allFeatures);
    //         setObcine(newObcine);

    //         loadGameState(randomFeature);
    //         loadStats();
    //     }

    //     initGame();
    // }, []);

    // Write to localStorage on gameState change
    useEffect(() => {
        if (gameState) {
            localStorage.setItem("gameState", JSON.stringify(gameState));
        }
    }, [gameState]);

    // Write to localStorage on stats change
    useEffect(() => {
        if (stats) {
            stats.winProcentile = stats.playedGames > 0 ? Math.round((stats.wins / stats.playedGames) * 100) : 0;
   
            localStorage.setItem("stats", JSON.stringify(stats));
        }
    }, [stats]);

    async function resetGame() {
        const daily = await getDaily();
        const allFeatures = await fetchAllFeatures();

        if (!allFeatures) {
            console.log("Data is empty");
            return;
        }

        setAllFeatures(allFeatures);

        const newObcine = getObcineFromFeatures(allFeatures);
        setObcine(newObcine);

        const dailyFeature = await getFeatureFromNaziv(allFeatures, daily.solution);

        if (!dailyFeature) {
            console.log("Daily feature is empty");
            return;
        }

        setGameState({
            solution: dailyFeature.properties?.NAZIV,
            obcinaFeature: dailyFeature,
            numberOfGuesses: 1,
            showSatellite: false,
            win: false,
            lose: false,
            hints: {
                outline: false,
                region: false,
                adjacentObcine: false,
                map: false,
            },
        });

        // loadStats();
    }
     
    // Reset game on ESC for now
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                resetGame();
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);
    

    // Update hints
    function updateHints(level: number) {
        const newHints = {
            outline: level >= 1,
            region: level >= 2,
            adjacentObcine: level >= 3,
            map: level >= 4,
        };
    
        setGameState(prev => ({
            ...prev!,
            hints: newHints
        }));
    }

    // useCallback ?
    function handleGuess(guess: string) {
        const normalizedGuess = normalizeText(guess);
        const normalizedObcine = obcine?.map(obcina => normalizeText(obcina));
    
        // Unknown obcina typed
        if (!normalizedObcine?.includes(normalizedGuess)) {
            setLastGuess(guess);
            setIsUnkownGuess(true);
            setTimeout(() => setIsUnkownGuess(false), 2000);
        } 
        else {
            if (!gameState) {
                console.log("Game state is empty");
                return;
            }
            
            // If correct word set win to true
            const win = isWin(guess, gameState.solution);
            let lose = gameState.numberOfGuesses >= 5;
            
            if (win) {
                setGameState(prev => ({
                    ...prev!,
                    win: true,
                }));

                if (stats) {    
                    let newMaxStreak = stats.maxStreak;

                    if (stats.streak + 1 > stats.maxStreak) { // + 1, da steje to zmago
                        newMaxStreak = stats.streak + 1;                       
                    }

                    setStats(prev => ({ 
                        ...prev!, 
                        playedGames: prev!.playedGames++,
                        wins: prev!.wins++,
                        streak: prev!.streak++,
                        maxStreak: newMaxStreak
                    }));
                }
            } 

            else if (lose) {
                setGameState(prev => ({
                    ...prev!,
                    lose: true,
                }));

                if (stats) {
                    setStats(prev => ({ 
                        ...prev!, 
                        playedGames: prev!.playedGames++,
                        streak: 0
                    }));
                }
            }

            // Wrong guess
            else {
                setGameState(prev => ({
                    ...prev!,
                    numberOfGuesses: prev!.numberOfGuesses + 1
                }));

                if (!gameState) {
                    console.log("Game state is empty");
                    return;
                }
                // Update hints
                const hintsLevel = gameState.numberOfGuesses;
                updateHints(hintsLevel);

                setIsWrongGuess(true);
                setTimeout(() => setIsWrongGuess(false), 2000);
            }
        }
    }

    function handleSatellite() {
        setGameState(prev => ({
            ...prev!,
            showSatellite: !prev!.showSatellite
        }));
    }

    if (!gameState) {
        console.log("Game state is empty");
        return;
    }
    
    console.log("Correct obcina: ", gameState.solution);

    return (
        <>
            {/* Unknown guess message */}
            { isUnknownGuess && <UnknownGuessMsg inputValue={lastGuess} /> }
            
            { gameState.lose && <LoseScreen obcina={gameState.solution} /> }
            { gameState.win && <WinScreen /> }

            {/* Map */}
            <div className="map offset-lg-3 col-lg-6 offset-md-1 col-md-10 justify-content-center d-flex">
                { isWrongGuess && <WrongGuessMsg /> }

                {/* FUj to */}
                { gameState.hints.outline && 
                    <button id="satellite-btn" onClick={handleSatellite}>
                        <img id="satellite-img" src="../../res/satellite.svg" />
                    </button> 
                }
                
                {/* Show map */}
                { (gameState.hints.map || gameState.hints.outline || gameState.hints.adjacentObcine) && allFeatures && 
                   gameState.obcinaFeature && <Map allFeatures={allFeatures} feature={gameState.obcinaFeature} hints={gameState.hints} showSatellite={gameState.showSatellite} /> }
                
                {/* Show region */}
                { gameState.hints.region && <Region obcina={gameState.solution} /> }
            </div>

            {/* Input */}
            <div className="col-lg-6 offset-lg-3 mt-3">
                { obcine && <Input inputValue={inputValue} setInputValue={setInputValue} handleGuess={handleGuess} numberOfGuesses={gameState.numberOfGuesses} obcine={obcine} /> }
            </div>
        </>
    );
}