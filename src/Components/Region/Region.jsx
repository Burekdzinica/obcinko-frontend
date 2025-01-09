import { useEffect } from "react";
import { useState } from "react";

import "./region.css"

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

    useEffect(() => {
        fetchRegion(obcina)
            .then(fetchedRegion => {
                if (fetchedRegion)
                    setRegion(fetchedRegion);

                else 
                    console.log("Region is empty(Region.jsx)");

            })
    }, []);

    return (
        <>
            <h2>Regija: { region }</h2>
        </>
    );
}