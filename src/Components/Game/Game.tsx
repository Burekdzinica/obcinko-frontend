import Input from "../Input/Input";
import Map from "../Map/Map";
import Region from "../Region/Region"
import WrongGuessMsg from "../WrongGuessMsg/WrongGuessMsg";
import UnknownGuessMsg from "../UnknownGuessMsg/UnknownGuessMsg";
import LoseScreen from "../LoseScreen/LoseScreen";
import WinScreen from "../WinScreen/WinScreen";

import { GeoJsonProps, Features, Feature, GameState, Stats } from "../../types/index";

import './game.css'

import { useState, useEffect } from "react";

// https://ipi.eprostor.gov.si/wfs-si-gurs-rpe/ogc/features/collections/SI.GURS.RPE:OBCINE/items?f=application%2Fgeo%2Bjson&limit=212
// Select random feature from json
async function fetchObcina() {
    try {
        const response = await fetch('/jsons/obcine.json');
        const data: GeoJsonProps = await response.json();

        if (!data) {
            console.log("Data is empty");
            return;
        }

        let features: Features  = data.features;
        let randomIndex = Math.floor(Math.random() * features.length);
        let randomFeature: Feature = features[randomIndex];

        return {"features": features, "randomFeature": randomFeature};
    }
    catch (error) {
        console.error("Error loading obcine.json: ", error)
        return;
    }
}

// Return list of obcine
function getObcine(allFeatures: Features) {
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

// https://www.youtube.com/watch?v=TNhaISOUy6Q 
//https://miro.com/
 

// Remove whitespaces, cases and šumniks
function normalizeText(text: string) {
    // Remove whitespaces
    text = text.trim();

    // Remove whitespace between "-"
    text = text.replace(/\s+-\s+/g, '-');

    // Case & šumnik insensitive
    text = text.toLowerCase().replace(/[čšž]/g, match => ({ č: 'c', š: 's', ž: 'z' })[match] ?? match);

    return text;
}

function isWin(guess: string, obcina: string) {
    const normalizedGuess = normalizeText(guess);
    const normalizedObcina = normalizeText(obcina);

    return normalizedGuess === normalizedObcina;
}

export default function Game() {
    const [inputValue, setInputValue] = useState('');

    const [isWrongGuess, setIsWrongGuess] = useState(false);
    const [isUnknownGuess, setIsUnkownGuess] = useState(false);
    const [lastUnknownGuess, setLastGuess] = useState(""); // save guess, so it doesn't change on input change
    
    const [allFeatures, setAllFeatures] = useState<Features>();
    const [obcine, setObcine] = useState<string[]>();
   
    const [gameState, setGameState] = useState<GameState>();
    const [stats, setStats] = useState<Stats>();


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


    // Get gameState from localStorage
    function loadGameState(randomFeature: Feature) {
        const savedState = localStorage.getItem("gameState");

            if (savedState) {
                setGameState(JSON.parse(savedState));
            }
            else {
                setGameState({
                    obcina: randomFeature.properties?.NAZIV,
                    obcinaFeature: randomFeature,
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
    useEffect(() => {
        async function initGame() {
            const data = await fetchObcina();
    
            if (!data) {
                console.log("Data is empty");
                return;
            }

            const { features, randomFeature } = data;
            setAllFeatures(features);

            const newObcine = getObcine(features);
            setObcine(newObcine);

            loadGameState(randomFeature);
            loadStats();
        }

        initGame();
    }, []);

    // Write to localStorage on gameState change
    useEffect(() => {
        if (gameState) {
            localStorage.setItem("gameState", JSON.stringify(gameState));
        }
    }, [gameState]);

    // Write to localStorage on stats change
    useEffect(() => {
        console.log("eqe");
        if (stats) {
            stats.winProcentile = stats.playedGames > 0 ? Math.round((stats.wins / stats.playedGames) * 100) : 0;
   
            localStorage.setItem("stats", JSON.stringify(stats));
        }
    }, [stats]);

    console.log(localStorage.getItem("stats"));

    async function resetGame() {
        const data = await fetchObcina();
        if (!data) {
            console.log("Data is empty");
            return;
        }
    
        const { features, randomFeature } = data;
        setAllFeatures(features);
    
        const newObcine = getObcine(features);
        setObcine(newObcine);
    
        setGameState({
            obcina: randomFeature.properties?.NAZIV,
            obcinaFeature: randomFeature,
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
     
    // Reset game for now
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
            const win = isWin(guess, gameState.obcina);
            let lose = gameState.numberOfGuesses >= 5;
            
            if (win) {
                setGameState(prev => ({
                    ...prev!,
                    win: true,
                }));

                if (stats) {    
                    let newMaxStreak: number;

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
    
    console.log(gameState.obcina);

    


    return (
        <>
            {/* Unknown guess message */}
            { isUnknownGuess && <UnknownGuessMsg inputValue={lastUnknownGuess} /> }
            
            { gameState.lose && <LoseScreen obcina={gameState.obcina} /> }
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
                
                {/* Show map or outline or adjacent obcine */}
                { (gameState.hints.map || gameState.hints.outline || gameState.hints.adjacentObcine) && allFeatures && 
                   gameState.obcinaFeature && <Map allFeatures={allFeatures} feature={gameState.obcinaFeature} hints={gameState.hints} showSatellite={gameState.showSatellite} /> }
                
                { gameState.hints.region && <Region obcina={gameState.obcina} /> }
            </div>

            {/* Input */}
            <div className="col-lg-6 offset-lg-3 mt-3">
                { obcine && <Input inputValue={inputValue} setInputValue={setInputValue} handleGuess={handleGuess} numberOfGuesses={gameState.numberOfGuesses} obcine={obcine} /> }
            </div>
        </>
    );
}