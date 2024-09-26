import Input from "../Input/Input";
import Map from "../Map/Map";
import Outline from "../Outline/Outline";

import './game.css'

import { useState } from "react";
import { useEffect } from "react";

function generateRandomWord() {
    let randomWords  = ['boris', 'krompir', 'lulek'];
    let randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];

    return randomWord;
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

    useEffect (() => {
        setCorrectWord(generateRandomWord());
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
            setCorrectWord(generateRandomWord()); 
        } 
        else if (lose) {
            alert('You lose');

            setNumberOfGuesses(1);
            setCorrectWord(generateRandomWord()); 
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
                {showMap ? <Map /> : showOutline ? <Outline /> : null}
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
