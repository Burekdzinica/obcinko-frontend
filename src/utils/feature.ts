import { Feature, Features } from "../types";

export async function getFeatureFromNaziv(features: Features, naziv: string) {
    return features.find((feature) => feature.properties?.NAZIV === naziv);
}

// Return list of obcine
export function getObcineFromFeatures(allFeatures: Features) {
    const obcine: string[] = []; 

    allFeatures.forEach(feature => {
        if (!feature.properties) {
            console.error("Feature properties are empty");
            return;
        }
        const naziv = feature.properties.NAZIV;
        obcine.push(naziv);
    })
    
    return obcine; 
}