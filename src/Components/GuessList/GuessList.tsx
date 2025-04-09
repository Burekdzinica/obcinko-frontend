export default function GuessList() {
    const prevGuesses = localStorage.getItem("prevGuesses");
    const guesses = prevGuesses?.split(",");

    return (
        <div>
            <div className="flex gap-5 justify-center flex-wrap px-14">
                { guesses?.map((guess) => (
                    <p className="text-red-500 text-center">
                        {guess}
                    </p>
                ))}
            </div>
        </div>
    )
}