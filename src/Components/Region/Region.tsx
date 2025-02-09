import { useEffect } from "react";
import { useState } from "react";

import { RegionData } from "../../types/index";
 
import "./region.css"

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
        <div className="region-container">
            <h2>Regija: { region }</h2>
        </div>
    );
}