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

            return randomFeature;
        })
        .catch(error => {
            console.error("Error loading obcine.json: ", error)
            return null;
        });
}

export default function Game() {
    const [inputValue, setInputValue] = useState('');
    const [obcina, setObcina] = useState('');
    const [numberOfGuesses, setNumberOfGuesses] = useState(1);
    const [isWrongGuess, setIsWrongGuess] = useState(false);

    // Hints
    const [showOutline, setShowOutline] = useState(false);             // hint 1
    const [showRegion, setShowRegion] = useState(false);               // hint 2
    const [showNearbyObcine, setShowNearbyObcine] = useState(false);   // hint 3
    const [showMap, setShowMap] = useState(false);                     // hint 4

    const [obcinaFeature, setObcinaFeature] = useState(null);

    // TODO: put in useEffect instead of here
    // async function getRandomObcina() {
    //     let feature = await fetchObcina();
     
    //     if (feature) {
    //         setObcinaFeature(feature);
    //         setObcina(feature.properties.NAZIV);
    //     }
    //     else {
    //         console.log("Feature is empty(Game.jsx)");
    //     }         
    // }
    
    // Generate random word on start
    useEffect (() => {
        fetchObcina()
            .then(feature => {
                if (feature) {
                    setObcinaFeature(feature);
                    setObcina(feature.properties.NAZIV);
                }
                else 
                    console.log("Feature is empty(Game.jsx)");       
            })

        // getRandomObcina();
    }, [])


    const handleGuess = (guess) => {
        setNumberOfGuesses(prevCount => prevCount + 1);

        // If correct word set win to true
        const win = guess.toLowerCase() === obcina.toLowerCase(); 
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
                setShowNearbyObcine(true);
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

            setNumberOfGuesses(1);
            fetchObcina(); 
        } 
        else if (lose) {
            alert(obcina);

            // TODO remove this because this will be daily
            setShowOutline(false);
            setShowRegion(false);
            setShowNearbyObcine(false);
            setShowMap(false);

            setNumberOfGuesses(1);
            // getRandomObcina(); 

            fetchObcina()
            .then(feature => {
                if (feature) {
                    setObcinaFeature(feature);
                    setObcina(feature.properties.NAZIV);
                }
                else 
                    console.log("Feature is empty(Game.jsx)");       
            })
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
                {/* Show map or outline */}
                { (showMap || showOutline) ? <Map feature={obcinaFeature} showOutline={showOutline} showMap={showMap} /> : null }
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

