import './input.css';

export default function Input({ inputValue, setInputValue, handleGuess, numberOfGuesses }) {    
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();

        handleGuess(inputValue);
        setInputValue('');
    }

    return (
        <div className="col-lg-6 offset-lg-3 mt-3">
            <form onSubmit={handleSubmit}>
                { /* Input */ }
                <input className="form-control" placeholder="Vpiši občino" type="text" value={inputValue} onChange={handleInputChange} required />

                { /* Submit button */ }
                <button type="submit" className="btn btn-secondary col-lg-12"> {numberOfGuesses} / 5 </button>
            </form>
        </div>
    )
}