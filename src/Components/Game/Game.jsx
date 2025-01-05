import Input from "../Input/Input";
import Map from "../Map/Map";

import './game.css'

import { useState, useEffect } from "react";

// https://ipi.eprostor.gov.si/wfs-si-gurs-rpe/ogc/features/collections/SI.GURS.RPE:OBCINE/items?f=application%2Fgeo%2Bjson&limit=212
function getRandomObcina() {
    // Select random feature from json
    return fetch('../../obcine.json')
        .then(response => response.json())
        .then(data => {
            let features = data.features;
            let randomIndex = Math.floor(Math.random() * features.length);
            let randomFeature = features[randomIndex];

            return randomFeature;
        })
        .catch(error => {
            console.error("Error loading json: ", error)
            return null;
        });
}

export default function Game() {
    const [inputValue, setInputValue] = useState('');
    const [correctWord, setCorrectWord] = useState('');
    const [numberOfGuesses, setNumberOfGuesses] = useState(1);
    const [isWrongGuess, setIsWrongGuess] = useState(false);

    const [showOutline, setShowOutline] = useState(false);
    const [showRegion, setShowRegion] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showObcina, setShowObcina] = useState(false);

    const [obcinaFeature, setObcinaFeature] = useState(null);

    const fetchObcina = async () => {
        let feature = await getRandomObcina();
     
        if (feature) {
            setObcinaFeature(feature);
            setCorrectWord(feature.properties.NAZIV);
        }
        else {
            console.log("Feature is empty(Game.jsx)");
        }         
    }

    // Generate random word on start
    useEffect (() => {
        fetchObcina();
    }, [])

    const handleGuess = (guess) => {
        setNumberOfGuesses(prevCount => prevCount + 1);

        const win = guess === correctWord;
        let lose = false;

        // Guesses
        switch (numberOfGuesses) {
            case 1:
                setShowOutline(true);
                break;
                
            case 2:
                setShowRegion(true);
                break;

            case 3: 
                setShowMap(true);
                break;
                
            case 4:
                setShowObcina(true);
                break;

            case 5:
                lose = true;
                break;
        }

        if (win) {
            alert('You win!!!');

            setNumberOfGuesses(1);
            fetchObcina(); 
        } 
        else if (lose) {
            alert(correctWord);

            // TODO remove this because this will be daily
            setShowOutline(false);
            setShowRegion(false);
            setShowMap(false);
            setShowObcina(false);

            setNumberOfGuesses(1);
            fetchObcina(); 
        }
        // Wrong guess
        else {
            setIsWrongGuess(true);
            setTimeout(() => setIsWrongGuess(false), 2000);
        }

        setInputValue('');
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
                {/* Show Map or show Outline */}
                {/* {showMap ? <Map feature={obcinaFeature} showOutline={showOutline} showMap={showMap}  /> : showOutline ? <Outline feature={obcinaFeature} /> : null} */}
                {(showMap || showOutline) ? (
                    <Map feature={obcinaFeature} showOutline={showOutline} showMap={showMap} />
                ) : null}
            </div>

            {/* Input */}
            <div>
                <Input inputValue={inputValue} setInputValue={setInputValue} handleGuess={handleGuess} numberOfGuesses={numberOfGuesses} />
            </div>

            {/* Region */}
            <div className="col-lg-6 offset-lg-5 mt-3">
                { showRegion && <h2 style={{ color: 'dimgray' }}> Regija: Gorenjska </h2> }
            </div>
        </>
    );
}

