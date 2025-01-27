import { useEffect } from "react";
import { useState } from "react";

import { RegionData } from "../../types/index";
 
import "./region.css"

// Fetch region name
function fetchRegion(obcina: string) {
    return fetch('../../regije.json')
        .then(response => response.json())
        .then((data: RegionData) => {
            if (!data) {
                console.error("Data is empty");
                console.log(obcina);
                return;
            }

            for (let region in data) {
                if (data[region].includes(obcina)) {
                    return region;
                }
            }
        })
        .catch(error => {
            console.error("Error loading regije.json: ", error)
            return null;
        });
}

export default function Region({ obcina }: { obcina: string }) {
    const [region, setRegion] = useState("");

    function updateRegion() {
        fetchRegion(obcina)
            .then(fetchedRegion => {
                if (!fetchedRegion) {
                    console.log("Region is empty(Region.jsx)");
                    console.log(obcina);
                    return;
                }
                setRegion(fetchedRegion);
            })
            .catch(error => {
                console.error("Error getting fetched region", error);
                return null;
            })
    }

    useEffect(() => {
        updateRegion();
    }, []);

    return (
        <h2>Regija: { region }</h2>
    );
}