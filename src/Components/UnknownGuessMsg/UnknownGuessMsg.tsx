export default function UnknownGuessMsg({ inputValue }: {inputValue: string} ) {
    return (
        <div className="bg-neutral-800/50 -translate-x-1/2 -translate-y-1/2 border p-3 z-50 animate-fadeSlideDown text-white font-semibold text-xl z-999 text-center whitespace-nowrap absolute top-40 left-1/2 rounded-primary">
            Neznana občina: { inputValue }
        </div>
    )
}