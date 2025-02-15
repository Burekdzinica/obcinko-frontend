import './unknownGuess.css';

export default function UnknownGuessMsg({ inputValue }: {inputValue: string} ) {
    return (
        <div className="unknown-guess-msg">
            Neznana občina: { inputValue }
        </div>
    )
}