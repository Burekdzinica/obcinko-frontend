import Input from "../Input/Input";

import { useState } from "react";
import { useEffect } from "react";

function randomWord() {
    let randomWords  = ['boris', 'krompir', 'lulek'];
    let randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];

    return randomWord;
}

export default function Game() {
    const [inputValue, setInputValue] = useState('');
    const [correctWord, setCorrectWord] = useState('');
    const [numberOfGuesses, setNumberOfGuesses] = useState(1);

    useEffect (() => {
        setCorrectWord(randomWord());
    }, [])

    const handleGuess = (guess) => {
        setNumberOfGuesses(prevCount => prevCount + 1);

        if (guess === correctWord) {
            alert('You win!!!');

            setNumberOfGuesses(1);
        } 
        else if (numberOfGuesses === 5) {
            alert('You lose');

            setNumberOfGuesses(1);
        }

        setCorrectWord(randomWord()); 
        setInputValue('');
    };

    return (
        <div>
            <Input inputValue={inputValue} setInputValue={setInputValue} handleGuess={handleGuess} />
        </div>
    );
}
