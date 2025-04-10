import { GAME_MODES } from "../../types";

interface Props {
    solution: string;
    gameMode: GAME_MODES;
}

export default function GuessList({ solution, gameMode }: Props) {
    let guessList = "";
    
    switch (gameMode) {
        case  GAME_MODES.DAILY: 
            guessList = "prevGuessesDaily";
            break;

        case GAME_MODES.PRACTICE:
            guessList = "prevGuessesPractice"
            break;
    }



    const prevGuesses = localStorage.getItem(guessList);
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