import { useEffect } from "react";
import { useState } from "react";

import { RegionData } from "../../types/index";

async function fetchRegion(obcina: string) {
    try {
        const response = await fetch('../../jsons/regije.json');
        const regions: RegionData = await response.json();

        for (let region in regions) {
            if (regions[region].includes(obcina)) {
                return region;
            }
        }
    }
    catch (error) {
        console.error("Error loading regije.json: ", error)
        return;
    }
}

export default function Region({ obcina }: { obcina: string }) {
    const [region, setRegion] = useState("");

    async function updateRegion() {
        const region = await fetchRegion(obcina);

        if (!region) {
            console.log("Region is empty " + obcina);
            return;
        }

        setRegion(region);
    }
    
    useEffect(() => {
        updateRegion();
    }, [obcina]);

    return (
        <div className="region-container rounded z-[999] p-1.5 bg-black absolute bottom-2.5 right-2.5 border-1 border-white/50">
            <h2 className="text-txt m-0 max-sm:text-sm">Regija: { region }</h2>
        </div>
    );
}