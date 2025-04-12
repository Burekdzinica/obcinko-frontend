export default function WrongGuessMsg() {
    return (
        <div className="bg-red-950 z-[999] m-2 max-w-80 border-1 border-red-800 p-2.5 rounded 
            -translate-x-1/2 -translate-y-1/2 text-red-600 text-center text-base font-bold absolute 
            top-1/2 left-1/2 animate-shake whitespace-nowrap"
        >
            <p className="m-0">
                Napačen odgovor
            </p>
        </div>
    )
}