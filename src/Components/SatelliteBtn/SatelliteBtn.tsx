import { SatelliteBtnProps } from "../../types"

export default function SatelliteBtn({handleSatellite}: SatelliteBtnProps) {
    return (
        <>
            <button className="hover:!bg-primaryHover active:!bg-active absolute bottom-2.5 left-2.5 w-16 max-sm:w-12 rounded z-[999] 
                p-2.5 border-1 !border-primary !bg-primary" 
                onClick={handleSatellite}
            >

                <img className="invert" 
                    src="../../res/satellite.svg"
                    alt="SatelliteBtn" 
                />
            </button> 
        </>
    )

}