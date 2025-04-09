export default function AlreadyGuessedMsg({ obcina }: {obcina: string} ) {
    return (
        <div className="bg-neutral-800 -translate-x-1/2 -translate-y-1/2 border p-3 z-[9999] animate-fadeSlideDown 
            text-white font-semibold text-xl text-center whitespace-nowrap absolute top-48 left-1/2 rounded">
            Že ugibana občina: { obcina }
        </div>
    )
}