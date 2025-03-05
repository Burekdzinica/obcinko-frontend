import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { } from "leaflet";
import { AdjacentObcineProps, Feature, Features, RegionData } from "../../../types/index";
import { config } from "../../../config/config";

const adjacentObcineOptions = config.adjacentObcineOptions;
const boundsOptions = config.boundsOptions;
const tooltipOptions = config.tooltipOptions;

const Options = {
    ADJACENT: "ADJACENT" as const,
    CENTER: "CENTER" as const,
};

// Return list of features from sosednjeObcine.json
async function findAdjacentFeatures(allFeatures: Features, targetFeature: Feature) {
    try {
        if (!targetFeature) {
            console.log("Target feature is empty");
            return;
        }
        
        const response = await fetch('../../jsons/sosednjeObcine.json');
        const obcine: RegionData = await response.json();


        // Get obcine naziv from adjacent obcina
        const targetObcina = targetFeature.properties?.NAZIV;
        const adjacentObcine = obcine[targetObcina];

        // const adjacentObcine = await findAdjacentObcine(targetFeature);
    
        if (!adjacentObcine) {
            console.log("Adjacent features are empty");
            return;
        }
    
        let adjacentFeatures: Features = [];

        allFeatures.forEach(feature => {
            if (!feature.properties) {
                console.error("Random feature properties is empty");
                return;
            }
    
            const obcina = feature.properties.NAZIV;
    
            if (adjacentObcine.includes(obcina)) {
                adjacentFeatures.push(feature);
            }
        })
    
        return adjacentFeatures;
    }
    catch (error) {
        console.error("Error loading sosednjeObcine.json: ", error);
        return;
    }
}


export default function AdjacentObcine({ options, allFeatures, targetFeature }: AdjacentObcineProps) {
    const map = useMap();

    const featureGroup = L.featureGroup();

    useEffect(() => {        
        async function addToMap() {
            const adjacentFeatures =  await findAdjacentFeatures(allFeatures, targetFeature);
    
            if (!adjacentFeatures) {
                console.error("Adjacent features is empty");
                return;
            }
            
            adjacentFeatures.forEach(feature => {
                const adjacentLayer = L.geoJSON(feature, { 
                    ...adjacentObcineOptions,
                    
                    // Add naziv to every adjacent obcina
                    onEachFeature: (feature: Feature, layer: L.Layer) => {
                        layer.bindTooltip(feature.properties?.NAZIV, tooltipOptions);
                    }, 
                }); 
    
                featureGroup.addLayer(adjacentLayer); // add features to group
            });

            featureGroup.addTo(map);
            
            // Don't fit if whole map
            if (options === Options.ADJACENT) {
                map.flyToBounds(featureGroup.getBounds(), boundsOptions);
                // map.fitBounds(featureGroup.getBounds());

                // map.setMaxBounds(featureGroup.getBounds()); /* ????? ne fitta bounds po temu */
            }
        }

        addToMap();

        // Clean the map from featureGroup
        return () => {
            map.removeLayer(featureGroup);
        }
    }, [allFeatures, targetFeature, map, options]);

    return null;
}