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
        <div className="rounded z-[999] p-1 px-2 !bg-primary absolute bottom-2.5 right-2.5 border-1 !border-primary">
            <p className="!text-primary text-3xl m-0 max-sm:text-sm">
                Regija: {region}
            </p>
        </div>
    );
}