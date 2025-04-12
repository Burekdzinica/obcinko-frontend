export default function UnknownGuessMsg({ inputValue }: {inputValue: string} ) {
    return (
        <div className="!bg-secondary -translate-x-1/2 -translate-y-1/2 border-1 !border-secondary p-2.5 z-[9999] animate-fadeSlideDown 
            !text-primary font-semibold text-xl text-center whitespace-nowrap absolute top-48 left-1/2 rounded">
            Neznana občina: { inputValue }
        </div>
    )
}