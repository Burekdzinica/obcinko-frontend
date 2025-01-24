import Input from "../Input/Input";
import Map from "../Map/Map";
import Region from "../Region/Region"

import './game.css'

import { useState, useEffect, useCallback } from "react";

// https://ipi.eprostor.gov.si/wfs-si-gurs-rpe/ogc/features/collections/SI.GURS.RPE:OBCINE/items?f=application%2Fgeo%2Bjson&limit=212
// Select random feature from json
function fetchObcina() {
    return fetch('../../obcine.json')
        .then(response => response.json())
        .then(data => {
            let features = data.features;
            let randomIndex = Math.floor(Math.random() * features.length);
            let randomFeature = features[randomIndex];

            return {"features": features, "randomFeature": randomFeature};
        })
        .catch(error => {
            console.error("Error loading obcine.json: ", error)
            return null;
        });
}

 // https://www.youtube.com/watch?v=TNhaISOUy6Q 
 //https://miro.com/
 
function isWin(guess, obcina) {
    // Remove whitespaces from both sides
    let normalizedGuess = guess.trim();

    // Remove whitespace between "-"
    normalizedGuess = normalizedGuess.replace(/\s+-\s+/g, '-');
    
    // Case & šumnik insensitive
    const normalizedObcina = obcina.toLowerCase().replace(/[čšž]/g, match => ({ č: 'c', š: 's', ž: 'z' })[match]);
    normalizedGuess = normalizedGuess.toLowerCase().replace(/[čšž]/g, match => ({ č: 'c', š: 's', ž: 'z' })[match]);
    
    // Return if guess is correct
    return normalizedGuess === normalizedObcina;
}

export default function Game() {
    const [inputValue, setInputValue] = useState('');
    const [obcina, setObcina] = useState(''); // obcina naziv
    const [numberOfGuesses, setNumberOfGuesses] = useState(1);
    const [isWrongGuess, setIsWrongGuess] = useState(false);

    const [obcinaFeature, setObcinaFeature] = useState(null);
    const [allFeatures, setAllFeatures] = useState(null);

    // Hints
    const [hints, setHints] = useState({
        outline: false,
        region: false,
        adjacentObcine: false,
        map: false,
    });

    // Update hints
    function updateHints(level) {
        setHints(prev => ({
            ...prev, // copy previous object state
            outline: level >= 1,
            region: level >= 2,
            adjacentObcine: level >= 3,
            map: level >= 4,
        }));
    }

    function initGame() {
        fetchObcina()
            .then(data => {
                let feature = data.randomFeature;
                let allFeatures = data.features;
    
                setObcinaFeature(feature);
                setAllFeatures(allFeatures);
                setObcina(feature.properties.NAZIV);
            })
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
                let feature = data.randomFeature;

                setObcinaFeature(feature);
                setObcina(feature.properties.NAZIV);
            })
    }

    // Generate random word on start
    useEffect (() => {
        initGame();
    }, [])

    const handleGuess = useCallback((guess) => {
        setNumberOfGuesses(prevCount => prevCount + 1);

        // If correct word set win to true
        const win = isWin(guess, obcina);
        let lose = numberOfGuesses >= 5;
        
        // Update hints
        const hintsLevel = numberOfGuesses;
        updateHints(hintsLevel);

        if (win) {
            alert('You win!!!');
            resetGame();
        } 
        else if (lose) {
            alert(obcina);
            resetGame();
        }
        // Wrong guess
        else {
            setIsWrongGuess(true);
            setTimeout(() => setIsWrongGuess(false), 2000);
        }
    }, [obcina, numberOfGuesses, updateHints, resetGame]);

    return (
        <>
            {/* Wrong guess message */}
            {isWrongGuess && (
                <div className="wrong-guess-message">
                    Wrong guess! Try again.
                </div>
            )}

            {/* Map */}
            <div className="map offset-lg-3 col-lg-6 offset-md-1 col-md-10 justify-content-center d-flex"> 
                {/* Show map or outline or adjacent obcine */}
                { (hints.map || hints.outline || hints.adjacentObcine) ? <Map allFeatures={allFeatures} feature={obcinaFeature} hints={hints} /> : null }
            </div>

            {/* Input */}
            <div>
                <Input inputValue={inputValue} setInputValue={setInputValue} handleGuess={handleGuess} numberOfGuesses={numberOfGuesses} />
            </div>

            {/* Region */}
            <div className="col-lg-6 offset-lg-5 mt-3">
                { hints.region ? <Region obcina={obcina} /> : null}
            </div>
        </>
    );
}