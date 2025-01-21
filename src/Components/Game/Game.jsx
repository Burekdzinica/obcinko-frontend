import Input from "../Input/Input";
import Map from "../Map/Map";
import Region from "../Region/Region"

import './game.css'

import { useState, useEffect } from "react";

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

function isWin(guess, obcina) {
    // Remove whitespaces from both sides
    let normalizedGuess = guess.trim();

    // Remove whitespace between x - y
    normalizedGuess = normalizedGuess.replace(/\s+-\s+/g, '-');
    
    // Case & šumnik insensitive
    const normalizedObcina = obcina.toLowerCase().replace(/[čšž]/g, match => ({ č: 'c', š: 's', ž: 'z' })[match]);
    normalizedGuess = normalizedGuess.toLowerCase().replace(/[čšž]/g, match => ({ č: 'c', š: 's', ž: 'z' })[match]);
    
    // Return if guess is correct
    return normalizedGuess === normalizedObcina;
}

export default function Game() {
    const [inputValue, setInputValue] = useState('');
    const [obcina, setObcina] = useState('');
    const [numberOfGuesses, setNumberOfGuesses] = useState(1);
    const [isWrongGuess, setIsWrongGuess] = useState(false);

    // Hints
    const [showOutline, setShowOutline] = useState(false);                 // hint 1
    const [showRegion, setShowRegion] = useState(false);                   // hint 2
    const [showAdjacentObcine, setShowAdjacentObcine] = useState(false);   // hint 3
    const [showMap, setShowMap] = useState(false);                         // hint 4

    const [obcinaFeature, setObcinaFeature] = useState(null);
    const [allFeatures, setAllFeatures] = useState(null);


    // This is until i make it daily
    function resetPlay() {
        setShowOutline(false);
        setShowRegion(false);
        setShowAdjacentObcine(false);
        setShowMap(false);
        setNumberOfGuesses(1);

        fetchObcina()
            .then(data => {
                let feature = data.randomFeature;

                setObcinaFeature(feature);
                setObcina(feature.properties.NAZIV);
            })
    }

    // Generate random word on start
    useEffect (() => {
        fetchObcina()
            .then(data => {
                let feature = data.randomFeature;
                let allFeatures = data.features;

                setObcinaFeature(feature);
                setAllFeatures(allFeatures);
                setObcina(feature.properties.NAZIV);
            })
    }, [])
    
    function handleGuess(guess) {
        setNumberOfGuesses(prevCount => prevCount + 1);

        // If correct word set win to true
        const win = isWin(guess, obcina);
        let lose = false;

        const hints = numberOfGuesses;

        // Hints
        switch (hints) {
            case 1:
                setShowOutline(true);
                break;
                
            case 2:
                setShowRegion(true);
                break;

            case 3: 
                setShowAdjacentObcine(true);
                break;
                
            case 4:
                setShowMap(true);
                break;

            case 5:
                lose = true;
                break;
        }

        if (win) {
            alert('You win!!!');
            resetPlay();
        } 
        else if (lose) {
            alert(obcina);
            resetPlay();
        }
        // Wrong guess
        else {
            setIsWrongGuess(true);
            setTimeout(() => setIsWrongGuess(false), 2000);
        }
    };

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
                { (showMap || showOutline || showAdjacentObcine) ? <Map allFeatures={allFeatures} feature={obcinaFeature} showOutline={showOutline} showMap={showMap} showAdjacentObcine={showAdjacentObcine} /> : null }
            </div>

            {/* Input */}
            <div>
                <Input inputValue={inputValue} setInputValue={setInputValue} handleGuess={handleGuess} numberOfGuesses={numberOfGuesses} />
            </div>

            {/* Region */}
            <div className="col-lg-6 offset-lg-5 mt-3">
                { showRegion ? <Region obcina={obcina} /> : null}
            </div>
        </>
    );
}