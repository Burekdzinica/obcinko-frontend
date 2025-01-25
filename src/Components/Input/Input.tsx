import { InputProps, InputEvent, FormEvent } from "../../types/index";

import './input.css';


export default function Input({ inputValue, setInputValue, handleGuess, numberOfGuesses }: InputProps) {    
    // Update value with new value
    function handleInputChange(event: InputEvent) {
        setInputValue(event.target.value);
    }
    
    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        handleGuess(inputValue);

        // Clear text from input bar
        setInputValue('');
    }

    return (
        <div className="col-lg-6 offset-lg-3 mt-3">
            <form onSubmit={handleSubmit}>
                { /* Input  TODO: Make popop on no input */ }
                <input className="form-control" placeholder="Vpiši občino" type="text" value={inputValue} onChange={handleInputChange} required />

                { /* Submit button */ }
                <button type="submit" className="btn btn-secondary col-lg-12"> {numberOfGuesses} / 5 </button>
            </form>
        </div>
    )
}