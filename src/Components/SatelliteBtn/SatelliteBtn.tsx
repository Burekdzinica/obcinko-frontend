import { SatelliteBtnProps } from "../../types"

export default function SatelliteBtn({handleSatellite}: SatelliteBtnProps) {
    return (
        <>
            <button className="hover:!bg-hover active:!bg-active absolute bottom-2.5 left-2.5 w-16 h-16 rounded-primary z-[999] p-2.5 border-1 border-white/50 bg-black" 
                onClick={handleSatellite}>

                <img className="invert sepia saturate-0 hue-rotate-[14deg] brightness-102 contrast-103" 
                    src="../../res/satellite.svg"
                    alt="SatelliteBtn" 
                />
            </button> 
        </>
    )

}