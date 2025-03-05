import Input from "../Input/Input";
import Map from "../Map/Map";
import Region from "../Region/Region"
import WrongGuessMsg from "../WrongGuessMsg/WrongGuessMsg";
import UnknownGuessMsg from "../UnknownGuessMsg/UnknownGuessMsg";
import LoseScreen from "../LoseScreen/LoseScreen";
import WinScreen from "../WinScreen/WinScreen";
import SatelliteBtn from "../SatelliteBtn/SatelliteBtn";

// import { writeObcineToFile } from '../../utils/utils';
import { config } from "../../config/config";
import { GeoJsonProps, Features, Feature, GameState, Stats, GameProps, GAME_MODES } from "../../types/index";

import './game.css'

import { useState, useEffect } from "react";
import { normalizeText, loadFromLocalStorage } from "../../utils/other";
import { getFeatureFromNaziv, getObcineFromFeatures } from "../../utils/feature";

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

async function getDaily() {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // yyyy-mm-dd

    const apiUrl = process.env.REACT_APP_API_URL + formattedDate;

    const solution = await fetchSolution(apiUrl);

    return solution;
}

function isWin(guess: string, solution: string) {
    const normalizedGuess = normalizeText(guess);
    const normalizedSolution = normalizeText(solution);

    return normalizedGuess === normalizedSolution;
}

export default function Game({ gameMode }: GameProps) {
    const [inputValue, setInputValue] = useState('');
    const [isWrongGuess, setIsWrongGuess] = useState(false);
    const [isUnknownGuess, setIsUnkownGuess] = useState(false);
    const [lastGuess, setLastGuess] = useState(""); // save guess, so it doesn't change on input change
    
    const [allFeatures, setAllFeatures] = useState<Features>();
    const [obcine, setObcine] = useState<string[]>();
   
    const [gameState, setGameState] = useState<GameState>();
    const [stats, setStats] = useState<Stats>();

    function loadLocalStorage() {
        // const savedGameState = loadFromLocalStorage("gameState", config.gameStateDefault);
        const savedStats = loadFromLocalStorage("stats", config.statsDefault);
    
        // setGameState(savedGameState);
        setStats(savedStats);
    }

    useEffect(() => {
        loadLocalStorage();
    }, []);

    useEffect(() => {
        switch (gameMode) {
            case GAME_MODES.DAILY:
                startDailyGame();
                break;

            case GAME_MODES.PRACTICE:
                startPracticeGame();
                break;
        }

    }, [gameMode]);

    function initGameState(feature: Feature) {
        setGameState({
            solution: feature.properties?.NAZIV,
            feature: feature,
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
    
    async function startDailyGame() {
        const daily = await getDaily();
        const allFeatures = await fetchAllFeatures();

        if (!allFeatures) {
            console.log("Data is empty");
            return;
        }

        setAllFeatures(allFeatures);

        const newObcine = getObcineFromFeatures(allFeatures);
        setObcine(newObcine);

        const feature = await getFeatureFromNaziv(allFeatures, daily.solution);

        if (!feature) {
            console.log("Feature is empty");
            return;
        }

        const savedState = localStorage.getItem("gameState");

        if (savedState) {
            setGameState(JSON.parse(savedState));
        }
        else {
            initGameState(feature);
        }
    }

    async function startPracticeGame() {
        const feature = await fetchRandomFeature();
        const allFeatures = await fetchAllFeatures();

        if (!allFeatures) {
            console.log("Data is empty");
            return;
        }

        if (!feature) {
            console.log("Feature is empty");
            return;
        }

        setAllFeatures(allFeatures);

        initGameState(feature);
    }

   

    
    function updateStats(win: boolean, lose: boolean) {
        if (!stats) 
            return;

        if (win) {
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

        else if (lose) {
            setStats(prev => ({ 
                ...prev!, 
                playedGames: prev!.playedGames++,
                streak: 0
            }));
        }
    }

    // Write to localStorage on gameState change
    useEffect(() => {
        if (!gameState)
            return;
            
        // Only save daily games
        if (gameMode === GAME_MODES.DAILY)
            localStorage.setItem("gameState", JSON.stringify(gameState));
        
    }, [gameState]);

    // Write to localStorage on stats change
    useEffect(() => {
        if (stats) {
            stats.winProcentile = stats.playedGames > 0 ? Math.round((stats.wins / stats.playedGames) * 100) : 0;
   
            localStorage.setItem("stats", JSON.stringify(stats));
        }
    }, [stats]);




    // For practice mode
    async function restartGame() {
        const feature = await fetchRandomFeature();

        if (!feature) {
            console.log("Feature is empty");
            return;
        }

        setGameState({
            solution: feature.properties?.NAZIV,
            feature: feature,
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
    }
         
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

    function handleDailyMode(win: boolean, lose: boolean) {
        if (win) {
            setGameState(prev => ({
                ...prev!,
                win: true,
            }));
        } 

        else if (lose) {
            setGameState(prev => ({
                ...prev!,
                lose: true,
            }));
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

            // WrongGuess msg
            setIsWrongGuess(true);
            setTimeout(() => setIsWrongGuess(false), 2000);
        }

        if (win || lose) {
            updateStats(win, lose);
        }
    }

    function handlePracticeMode(win: boolean, lose: boolean) {
        if (win) {
            setGameState(prev => ({
                ...prev!,
                win: true,
            }));
        } 

        else if (lose) {
            setGameState(prev => ({
                ...prev!,
                lose: true,
            }));
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

            // WrongGuess msg
            setIsWrongGuess(true);
            setTimeout(() => setIsWrongGuess(false), 2000);
        }

        if (win || lose) {
            updateStats(win, lose);
            restartGame();
        }
    }

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

            switch (gameMode) {
                case  GAME_MODES.DAILY: 
                    handleDailyMode(win, lose);
                    break;

                case GAME_MODES.PRACTICE:
                    handlePracticeMode(win, lose);
                    break;
            }
        }
    }

    function handleSatellite() {
        setGameState(prev => ({
            ...prev!,
            showSatellite: !prev!.showSatellite
        }));
    }

    return (
        <>         
            {/* Unknown guess message */}
            { isUnknownGuess && 
                <UnknownGuessMsg inputValue={lastGuess} /> 
            }
            
            { gameState?.lose && 
                <LoseScreen obcina={gameState.solution} /> 
            }

            { gameState?.win && 
                <WinScreen /> 
            }

            {/* Map */}
            <div className="relative rounded-primary p-0 m-auto bg-map !w-[70vw] h-[67vh] border-1 border-1 border-white/25">
                { isWrongGuess && 
                    <WrongGuessMsg /> 
                }

                {/* FUj to */}
                { gameState?.hints.outline && 
                    <SatelliteBtn handleSatellite={handleSatellite} />
                }
                
                {/* Show map */}
                { (gameState?.hints.map || gameState?.hints.outline || gameState?.hints.adjacentObcine) && 
                    <Map 
                        allFeatures={allFeatures!} 
                        feature={gameState.feature} 
                        hints={gameState.hints} 
                        showSatellite={gameState.showSatellite} 
                    /> 
                }
                
                {/* Show region */}
                { gameState?.hints.region && 
                    <Region obcina={gameState.solution} /> 
                }
            </div>

            {/* Input */}
            <div className="col-lg-6 offset-lg-3 mt-3">
                { obcine && 
                    <Input 
                        inputValue={inputValue} 
                        setInputValue={setInputValue} 
                        handleGuess={handleGuess} 
                        numberOfGuesses={gameState!.numberOfGuesses} 
                        obcine={obcine} 
                        gameState={gameState!}
                    /> 
                }
            </div>
        </>
    );
}