import { useEffect } from "react";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, GeoJSON, useMap, TileLayer } from 'react-leaflet';
import { centroid, featureCollection } from "@turf/turf"; 
import { Feature, Features ,RegionData, AdjacentObcineProps, FitToBoundsProps, MapProps, ZoomOutProps } from "../../types/index";

import './map.css'


const centerSlovenia = [46.007, 14.856]; // Middle of Slovenia
const zoomSizeCenter = 8;
const zoomSizeAdjacent = 10.3;

// Map styles
const mapOptions = {
    scrollWheelZoom: false,
    attributionControl: false,
    zoomControl: false,
    dragging: false,
    doubleClickZoom: false,
    style: { backgroundColor: "#090909" },
};

// Return list of adjacent obcine naziv
function findAdjacentObcine(targetFeature: Feature) {
    return fetch('../../sosednjeObcine.json')
        .then(response => response.json())
        .then((data: RegionData) => {
            if (!targetFeature.properties) {
                console.error("Target feature properties is empty");
                return;
            }

            const targetObcina = targetFeature.properties.NAZIV;
            const adjacentObcine = data[targetObcina];

            return adjacentObcine;
        })
        .catch(error => {
            console.error("Error loading sosednjeObcine.json: ", error)
            return;
        });
}

// Return list of adjacent obcine features
function findAdjacentFeatures(allFeatures: Features, targetFeature: Feature) {
    return findAdjacentObcine(targetFeature)
        .then(data => {
            let adjacentFeatures: Features = [];
            const adjacentObcine = data;

            if (!adjacentObcine) {
                console.error("Adjacent obcine is empty");
                return;
            }
        
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
        })
        .catch(error => {
            console.error("Error in findAdjacentFeatures: ", error);
            return;
        });
}

// Show adjacent obcine on map
function ShowAdjacentObcine({ allFeatures, targetFeature }: AdjacentObcineProps) {
    const map = useMap();

    useEffect(() => {
        if (!targetFeature) {
            console.error("Feature is empty: showNearbyObcine");
            return;
        }

        findAdjacentFeatures(allFeatures, targetFeature)
            .then(adjacentFeatures => {
                if (!adjacentFeatures) {
                    console.error("Adjacent features is empty");
                    return null;
                }

                // Add adjacent features to the map
                adjacentFeatures.forEach(feature => {
                    const adjacentLayer = L.geoJSON(feature, 
                        { style: { color: 'red', weight: 0.5 },
                        // Add naziv to every adjacent obcina
                        onEachFeature: (feature: Feature, layer: L.Layer) => {
                            if (!feature.properties) {
                                console.error("Feature properties is empty");
                                return;
                            }

                            layer.bindTooltip(feature.properties.NAZIV, {
                                permanent: true,
                                direction: "center"                                
                            });
                        }, 
                    });

                    map.addLayer(adjacentLayer);
                    map.fitBounds(adjacentLayer.getBounds());
                });
            })
            .catch(error => {
                console.error("Error displaying adjacent features:", error);
                return;
            });
    }, []);
    return null;
}


// TODO: this useles just make .fitBounds
// Fit obcina to map center
function FitToBounds({ feature }: FitToBoundsProps) {
    const map = useMap();
    useEffect(() => {
        if (feature) {
            const geoJsonLayer: L.GeoJSON = L.geoJSON(feature);
            map.fitBounds(geoJsonLayer.getBounds());
        }
        else {
            console.log("Feature is empty: Map.jsx");
        }
    }, []);
  
    return null;
}

function getCenterOfObcin(allFeatures: Features, targetFeature: Feature) {
    return findAdjacentFeatures(allFeatures, targetFeature)
        .then(adjacentFeatures => {
            if (!adjacentFeatures) {
                console.error("Adjacent features are empty");
                return;
            }

            const features = [targetFeature, ...adjacentFeatures]; // combine all features
            const featCollection = featureCollection(features);
            
            const center = centroid(featCollection).geometry.coordinates;

            // Swap coordinate places because its reversed, why, idk
            [center[0], center[1]] = [center[1], center[0]];

            return center;
        })  
        .catch(error => {
            console.error("Error getting center of obcin", error);
            return;
        })
}

const Options = {
    ADJACENT: "ADJACENT" as const,
    CENTER: "CENTER" as const,
};

// Zoom out map based on attempt
function ZoomOut({ options, allFeatures, feature }: ZoomOutProps) {
    const map = useMap();
    
    useEffect(() => { 
        if (!map) {
            console.log("Map is empty");
            return;
        }

        // Zoom out to all adjacent obcine
        if (options === Options.ADJACENT) {
            if (!allFeatures || !feature) {
                console.error("All features or feature is empty");
                return;
            }
            
            getCenterOfObcin(allFeatures, feature) 
                .then(position => {
                    if (!position) {
                        console.error("Position is empty");
                        return;
                    }

                    if (Array.isArray(position) && position.length === 2) {
                        map.flyTo(position as LatLngTuple, zoomSizeAdjacent, { duration: 0.25 });
                    } 
                    else {
                        console.error("Position is not a valid LatLngTuple");
                    }
                })
        }

        // Zoom out to whole map
        else if (options === Options.CENTER) {
            if (Array.isArray(centerSlovenia) && centerSlovenia.length === 2) {
                map.flyTo(centerSlovenia as LatLngTuple, zoomSizeCenter, { duration: 0.25 });
            } 
            else {
                console.error("Position is not a valid LatLngTuple");
            }

            // Change naziv font size
            const tooltips = document.querySelectorAll(".leaflet-tooltip");
            tooltips.forEach(tooltip => {
                const element = tooltip as HTMLElement;
                element.style.fontSize = "7px";
            });
        }
    }, []);

    return null;
}

// Maybe change how to return because its really reduntant
export default function Map({ allFeatures, feature, hints }: MapProps) { 
    if (hints.map) {
        return (
            <MapContainer {...mapOptions}>
                {/* TODO: Remove names on map layer */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                <GeoJSON data={feature} style={{weight: 0.5}} />
                <FitToBounds feature={feature} />
                <ZoomOut options={Options.CENTER} />
            </MapContainer>
        )  
    }
    else if (hints.adjacentObcine) {
        return (
            <MapContainer {...mapOptions}>
                <GeoJSON data={feature} />
                <ShowAdjacentObcine allFeatures={allFeatures} targetFeature={feature} />
                <ZoomOut options={Options.ADJACENT} allFeatures={allFeatures} feature={feature} />
            </MapContainer>
        )
    }
    else if (hints.outline) {
        return (
            <MapContainer {...mapOptions}>
                <GeoJSON data={feature} />
                <FitToBounds feature={feature} />
            </MapContainer>
        )
    }
}