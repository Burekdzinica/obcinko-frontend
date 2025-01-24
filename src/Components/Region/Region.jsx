import { useEffect } from "react";
import { useState } from "react";

import "./region.css"

// Fetch region name
function fetchRegion(obcina) {
    return fetch('../../regije.json')
        .then(response => response.json())
        .then(data => {
            for (let region in data) {
                if (data[region].includes(obcina))
                    return region;
            }
        })
        .catch(error => {
            console.error("Error loading regije.json: ", error)
            return null;
        });
}

export default function Region({ obcina }) {
    const [region, setRegion] = useState("");

    function updateRegion() {
        fetchRegion(obcina)
            .then(fetchedRegion => {
                if (!fetchedRegion) {
                    console.log("Region is empty(Region.jsx)");
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