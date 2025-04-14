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

import { useState, useEffect } from "react";
import { normalizeText, loadFromLocalStorage } from "../../utils/other";
import { getFeatureFromNaziv, getObcineFromFeatures } from "../../utils/feature";
import GuessList from "../GuessList/GuessList";
import AlreadyGuessedMsg from "../AlreadyGuessedMsg/AlreadyGuessedMsg";

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

async function getDailySolution() {
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
    const [isAlreadyGuessed, setIsAlreadyGuessed] = useState(false);
    const [lastGuess, setLastGuess] = useState(""); // save guess, so it doesn't change on input change

    const [lastSolution, setLastSolution] = useState("");
    
    const [allFeatures, setAllFeatures] = useState<Features>();
    const [obcine, setObcine] = useState<string[]>();
   
    const [gameState, setGameState] = useState<GameState>();
    const [stats, setStats] = useState<Stats>();

    const [showLoseScreen, setShowLoseScreen] = useState<boolean>(false);
    const [showWinScreen, setShowWinScreen] = useState<boolean>(false);

    // Load stats from local storage
    useEffect(() => {
        const savedStats = loadFromLocalStorage("stats", config.statsDefault);
        setStats(savedStats);
    }, []);

    // Handle game mode changes
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

    const [winShown, setWinShown] = useState(false);
    const [loseShown, setLoseShown] = useState(false);

    // Write to localStorage on gameState change
    useEffect(() => {
        if (!gameState)
            return;

        // Add gameState to localStorage only on daily mode
        if (gameMode === GAME_MODES.DAILY) {
            localStorage.setItem("gameState", JSON.stringify(gameState));
        }

        // Dont show win/lose screens on satelite change
        if (gameState.win && !winShown) {
            setShowWinScreen(true);
            setWinShown(true);
        } 
        else if (gameState.lose && !loseShown) {
            setShowLoseScreen(true);
            setLoseShown(true);
        }

    }, [gameState]);

    function initGameState(feature: Feature) {
        setGameState({
            solution: feature.properties?.NAZIV,
            feature: feature,
            numberOfGuesses: 1,
            showSatellite: false,
            win: false,
            lose: false,
            hints: {
                region: false,
                adjacentObcine: false,
                map: false,
                satellite: false,
            }
        });
    }
    
    async function startDailyGame() {
        const daily = await getDailySolution();
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

        let savedState = localStorage.getItem("gameState");

        // If no game has been played, start the game
        if (!savedState) {
            initGameState(feature);
            return;
        }
            
        let savedGameState: GameState = JSON.parse(savedState);

        // If daily solution doesnt match the saved state, start new game   
        // New daily game     
        if (daily.solution !== savedGameState.solution) {
            deleteGuessList("prevGuessesDaily");
            initGameState(feature);
        }
        // Read the saved state
        // Existing game
        else {
            setGameState(savedGameState);
        }
    }

    async function startPracticeGame() {
        deleteGuessList("prevGuessesPractice");
        
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
            setStats(prev => ({ 
                ...prev!, 
                playedGames: prev?.playedGames ? prev.playedGames + 1 : 1,
                wins: win ? prev!.wins + 1 : prev!.wins,
                streak: win ? prev!.streak + 1 : 0,
                maxStreak: win && prev!.streak + 1 >  prev!.maxStreak ? prev!.streak + 1 : prev!.maxStreak
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
                region: false,
                adjacentObcine: false,
                map: false,
                satellite: false,
            },
        });
    }
         
    // Update hints
    function updateHints(level: number) {
        const newHints = {
            region: level >= 1,
            adjacentObcine: level >= 2,
            map: level >= 3,
            satellite: level >= 4,
        };
    
        setGameState(prev => ({
            ...prev!,
            hints: newHints
        }));
    }

    function nextHint() {
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

    function handleDailyMode(win: boolean, lose: boolean) {
        guessOutcome(win, lose);

        if (win || lose) {
            updateStats(win, lose);
        }
    }

    function handlePracticeMode(win: boolean, lose: boolean) {
        guessOutcome(win, lose);

        if (win || lose) {
            setLastSolution(gameState?.solution!);
            restartGame();
            deleteGuessList("prevGuessesPractice");
        }
    }

    function deleteGuessList(guessList: string) {
        localStorage.removeItem(guessList);
    }

    function guessOutcome(win: boolean, lose: boolean) {
        if (win) {
            setGameState(prev => ({
                ...prev!,
                win: true,
            }));

            setShowWinScreen(true);
        } 

        else if (lose) {
            setGameState(prev => ({
                ...prev!,
                lose: true,
            }));

            setShowLoseScreen(true);
        }

        // Wrong guess
        else {
            nextHint();
        }
    }

    function handleGuess(guess: string) {
        const normalizedGuess = normalizeText(guess);
        const normalizedObcine = obcine?.map(obcina => normalizeText(obcina));

        let guessList = "";
        // Get guessList based on game mode
        switch (gameMode) {
            case GAME_MODES.DAILY:
                guessList = "prevGuessesDaily";
                break;
            
            case GAME_MODES.PRACTICE:
                guessList = "prevGuessesPractice";
                break;                
        }

        const prevGuesses = localStorage.getItem(guessList);

        // Unknown obcina typed
        if (!normalizedObcine?.includes(normalizedGuess)) {
            setLastGuess(guess);
            setIsUnkownGuess(true);
            setTimeout(() => setIsUnkownGuess(false), 2000);

            return;
        } 
        
        if (!gameState) {
            console.log("Game state is empty");
            return;
        }

        // If already guessed obcina in playthrough
        if (prevGuesses?.includes(guess)) {
            setLastGuess(guess);
            setIsAlreadyGuessed(true);
            setTimeout(() => setIsAlreadyGuessed(false), 2000);

            return;
        }

        // If prevGuesses are in storage then concatanete them with ,
        if (prevGuesses) {
            const newPrevGuesses = prevGuesses + "," + guess;
            localStorage.setItem(guessList, newPrevGuesses);
        }
        else {
            localStorage.setItem(guessList, guess);
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

            {/* Already guessed message */}
            { isAlreadyGuessed && 
                <AlreadyGuessedMsg 
                    obcina={lastGuess} 
                />
            }
            
            { gameState && 
                <LoseScreen 
                    obcina={lastSolution || gameState.solution} 
                    show={showLoseScreen} 
                    setShow={setShowLoseScreen} 
                    gameMode={gameMode}
                /> 
            }

            { gameState && 
                <WinScreen 
                    show={showWinScreen}
                    setShow={setShowWinScreen}
                    gameMode={gameMode}
                /> 
            }

            {/* Input */}
            <div className="col-lg-6 offset-lg-3 mb-4">
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

            {/* Map */}
            <div className="relative rounded m-auto !w-[70vw] h-[67vh] border-1 !border-primary max-sm:h-80 mb-3">
                { isWrongGuess && 
                    <WrongGuessMsg /> 
                }

                {/* */}
                { gameState?.hints.satellite && 
                    <SatelliteBtn handleSatellite={handleSatellite} />
                }
                
                {/* Show map */}
                { gameState && 
                    <Map 
                        key={gameMode}
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

            <GuessList 
                solution={gameState?.solution!} 
                gameMode={gameMode}
            />
        </>
    );
}