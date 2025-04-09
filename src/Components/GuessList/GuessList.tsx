export default function GuessList({ solution }: { solution: string}) {
    const prevGuesses = localStorage.getItem("prevGuesses");
    const guesses = prevGuesses?.split(",");

    return (
        <div>
            <div className="flex gap-5 justify-center flex-wrap px-14 ">
                { guesses?.map((guess, index) => (
                    <p className={`text-center m-0  ${guess === solution ? 'text-green-500' : 'text-red-500'} `}
                        key={index}
                    >
                        {guess}
                    </p>
                ))}
            </div>
        </div>
    )
}