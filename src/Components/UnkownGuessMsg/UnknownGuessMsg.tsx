import './unknownGuess.css';

export default function UnknownGuessMsg({ inputValue }: {inputValue: string} ) {
    console.log(inputValue);
    return (
        <div className="unknown-guess-msg">
            Neznana občina: { inputValue }
        </div>
    )
}