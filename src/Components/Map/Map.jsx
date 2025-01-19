import './map.css'

import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, GeoJSON, useMap, TileLayer } from 'react-leaflet';
import { centroid, featureCollection } from "@turf/turf"; 

const centerSlovenia = [46.007, 14.856]; // Middle of Slovenia
const zoomSizeCenter = 8;
const zoomSizeAdjacent = 10.3;

const mapOptions = {
    scrollWheelZoom: false,
    attributionControl: false,
    zoomControl: false,
    dragging: false,
    doubleClickZoom: false,
    style: { backgroundColor: "#090909" },
};

function findAdjacentObcine(targetFeature) {
    return fetch('../../sosednjeObcine.json')
        .then(response => response.json())
        .then(data => {
            // Return list of adjacent obcine naziv
            const targetObcina = targetFeature.properties.NAZIV;

            const adjacentObcine = data[targetObcina];

            return adjacentObcine;
        })
        .catch(error => {
            console.error("Error loading sosednjeObcine.json: ", error)
            return null;
        });
}

function findAdjacentFeatures(allFeatures, targetFeature) {
    return findAdjacentObcine(targetFeature)
        .then(data => {
            // Return list of adjacent obcine features
            let adjacentFeatures = [];

            const adjacentObcine = data;
        
            allFeatures.forEach(feature => {
                const obcina = feature.properties.NAZIV;
        
                if (adjacentObcine.includes(obcina))
                    adjacentFeatures.push(feature);
            })

            return adjacentFeatures;
        })
        .catch(error => {
            console.error("Error in findAdjacentFeatures: ", error);
            return null;
        });
}

function ShowAdjacentObcine({ allFeatures, targetFeature }) {
    const map = useMap();

    useEffect(() => {
        if (!targetFeature) {
            console.error("Feature is empty: showNearbyObcine");
            return;
        }

        findAdjacentFeatures(allFeatures, targetFeature)
            .then(adjacentFeatures => {

                // Add adjacent features to the map
                adjacentFeatures.forEach(feature => {
                    const adjacentLayer = L.geoJSON(feature, 
                        { style: { color: 'red', weight: 0.5 },
                        // Add naziv to every adjacent obcina
                        onEachFeature: (feature, layer) => {
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
            });
    }, [])
}

// TODO: this useles just make .fitBounds
// Fit obcina to map center
function FitToBounds({ feature }) {
    const map = useMap();
    useEffect(() => {
        if (feature) {
            const geoJsonLayer = L.geoJSON(feature);
            map.fitBounds(geoJsonLayer.getBounds());
        }
        else {
            console.log("Feature is empty: Map.jsx");
        }
    }, []);
  
    return null;
}

function getCenterOfObcin(allFeatures, targetFeature) {
    return findAdjacentFeatures(allFeatures, targetFeature)
        .then(adjacentFeatures => {
            const features = [targetFeature, ...adjacentFeatures]; // combine all features

            const featCollection = featureCollection(features);
            
            const center = centroid(featCollection).geometry.coordinates;

            // Swap coordinate places because its reversed, why, idk
            [center[0], center[1]] = [center[1], center[0]];

            return center;
        })  
        .catch(error => {
            console.error("Error getting center of obcin", error);
            return null;
        })
}

const Options = {
    ADJACENT: "ADJACENT",
    CENTER: "CENTER"
};

// Zoom out map based on attempt
function ZoomOut({ options, allFeatures = null, feature = null }) {
    const map = useMap();

    useEffect(() => { 
        if (map) {
            // Zoom out to all adjacent obcine
            if (options === Options.ADJACENT) {
                getCenterOfObcin(allFeatures, feature) 
                    .then(position => {
                        map.flyTo(position, zoomSizeAdjacent, { duration: 0.25 }); 
                    })
            }

            // Zoom out to whole map
            else if (options === Options.CENTER) {
                map.flyTo(centerSlovenia, zoomSizeCenter, { duration: 1.5 }); 

                // Change naziv font size
                const tooltips = document.querySelectorAll(".leaflet-tooltip");
                tooltips.forEach(tooltip => {
                    tooltip.style.fontSize = "7px";
                });
            }
        }

        else 
            console.log("Map is empty");
    }, []);

    return null;
}

// Maybe change how to return because its really reduntant
export default function Map({ allFeatures, feature, showOutline, showMap, showAdjacentObcine }) { 
    if (showMap) {
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
    else if (showAdjacentObcine) {
        return (
            <MapContainer {...mapOptions}>
                <GeoJSON data={feature} />
                <ShowAdjacentObcine allFeatures={allFeatures} targetFeature={feature} />
                <ZoomOut options={Options.ADJACENT} allFeatures={allFeatures} feature={feature} />
            </MapContainer>
        )
    }
    else if (showOutline) {
        return (
            <MapContainer {...mapOptions}>
                <GeoJSON data={feature} />
                <FitToBounds feature={feature} />
            </MapContainer>
        )
    }
}