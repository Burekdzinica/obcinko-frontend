import Input from "../Input/Input";
import Map from "../Map/Map";
import Region from "../Region/Region"
import WrongGuessMsg from "../WrongGuessMsg/WrongGuessMsg";
import UnknownGuessMsg from "../UnkownGuessMsg/UnknownGuessMsg";
import LoseScreen from "../LoseScreen/LoseScreen";
import WinScreen from "../WinScreen/WinScreen";

import { GeoJsonProps, Features, Feature } from "../../types/index";

import './game.css'

import { useState, useEffect } from "react";

// https://ipi.eprostor.gov.si/wfs-si-gurs-rpe/ogc/features/collections/SI.GURS.RPE:OBCINE/items?f=application%2Fgeo%2Bjson&limit=212
// Select random feature from json
// function fetchObcina() {
//     return fetch('../../jsons/obcine.json')
//         .then(response => response.json())
//         .then((data: GeoJsonProps) => {
//             if (!data) {
//                 console.error("No data received from obcine.json");
//                 return;
//             }

//             let features: Features  = data.features;
//             let randomIndex = Math.floor(Math.random() * features.length);
//             let randomFeature: Feature = features[randomIndex];

//             return {"features": features, "randomFeature": randomFeature};
//         })
//         .catch(error => {
//             console.error("Error loading obcine.json: ", error)
//             return;
//         });
// }

// https://ipi.eprostor.gov.si/wfs-si-gurs-rpe/ogc/features/collections/SI.GURS.RPE:OBCINE/items?f=application%2Fgeo%2Bjson&limit=212
// Select random feature from json
async function fetchObcina() {
    try {
        const response = await fetch('../../jsons/obcine.json');
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
    const [obcina, setObcina] = useState(''); // naziv
    const [numberOfGuesses, setNumberOfGuesses] = useState(1);

    const [isWrongGuess, setIsWrongGuess] = useState(false);
    const [isUnknownGuess, setIsUnkownGuess] = useState(false);
    const [lastUnknownGuess, setLastGuess] = useState(""); // save guess, so it doesn't change on input change

    const [obcinaFeature, setObcinaFeature] = useState<Feature>();
    const [allFeatures, setAllFeatures] = useState<Features>();
    const [obcine, setObcine] = useState<string[]>();

    const [lose, setLose] = useState(false);
    const [win, setWin] = useState(false);


    const [showSatellite, setShowSatellite] = useState(false);

    // document.getElementById("satellite-btn")?.addEventListener("click", () => {
    //     setShowSatellite(!showSatellite);
    // }) 
    

    // TODO: fix this with input.tsx and without allFeatures?
    // Get all obcine
    useEffect(() => {
        if (allFeatures) {
            const newObcine = getObcine(allFeatures);
            setObcine(newObcine);
        }
    }, [allFeatures]);


    // Hints
    const [hints, setHints] = useState({
        outline: false,
        region: false,
        adjacentObcine: false,
        map: false,
    });

    // Update hints
    function updateHints(level: number) {
        setHints(prev => ({
            ...prev, // copy previous object state
            outline: level >= 1,
            region: level >= 2,
            adjacentObcine: level >= 3,
            map: level >= 4,
        }));
    }

    async function initGame() {
        const data = await fetchObcina();

        if (!data) {
            console.log("Data is empty");
            return;
        }

        const { features, randomFeature } = data;

        if (!randomFeature.properties) {
            console.error("Random feature properties is empty");
            return;
        }

        setObcinaFeature(randomFeature);
        setAllFeatures(features);
        setObcina(randomFeature.properties.NAZIV);
    }

    // This is until i make it daily
    function resetGame() {
        setNumberOfGuesses(1);
        
        setHints({
            outline: false,
            region: false,
            adjacentObcine: false,
            map: false, 
        });

        fetchObcina()
            .then(data => {
                if (!data) {
                    console.error("No data received from obcine.json");
                    return;
                }

                const { randomFeature } = data;

                if (!randomFeature.properties) {
                    console.error("Random feature properties is empty");
                    return null;
                }

                setObcinaFeature(randomFeature);
                setObcina(randomFeature.properties.NAZIV);
            })
    }

    // Generate random guess on start
    useEffect (() => {
        initGame();
    }, [])

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
            // If correct word set win to true
            const win = isWin(guess, obcina);
            let lose = numberOfGuesses >= 5;
            
            if (win) {
                setWin(true);
                // alert('You win!!!');
                // resetGame();
            } 
            else if (lose) {
                setLose(true);
                // alert(obcina);
                // resetGame();
            }
            // Wrong guess
            else {
                setNumberOfGuesses(prevCount => prevCount + 1);
                
                // Update hints
                const hintsLevel = numberOfGuesses;
                updateHints(hintsLevel);

                setIsWrongGuess(true);
                setTimeout(() => setIsWrongGuess(false), 2000);
            }
        }
    }
    
    console.log(obcina);
    // console.log(showSatellite);


    return (
        <>
            {/* Unknown guess message */}
            { isUnknownGuess && <UnknownGuessMsg inputValue={lastUnknownGuess} /> }
            
            { lose && <LoseScreen obcina={obcina} /> }
            { win && <WinScreen /> }

            {/* Map */}
            <div className="map offset-lg-3 col-lg-6 offset-md-1 col-md-10 justify-content-center d-flex">
                { isWrongGuess && <WrongGuessMsg /> }

                {/* FUj to */}
                { hints.outline && 
                    <button id="satellite-btn" onClick={() => setShowSatellite(prev => !prev)}  >
                        <img id="satellite-img" src="../../res/satellite.svg" />
                    </button> 
                }
                
                {/* Show map or outline or adjacent obcine */}
                { (hints.map || hints.outline || hints.adjacentObcine) && allFeatures && obcinaFeature && <Map allFeatures={allFeatures} feature={obcinaFeature} hints={hints} showSatellite={showSatellite} /> }
                
                { hints.region && <Region obcina={obcina} /> }
            </div>

            {/* Input */}
            <div className="col-lg-6 offset-lg-3 mt-3">
                { obcine && <Input inputValue={inputValue} setInputValue={setInputValue} handleGuess={handleGuess} numberOfGuesses={numberOfGuesses} obcine={obcine} /> }
            </div>
        </>
    );
}