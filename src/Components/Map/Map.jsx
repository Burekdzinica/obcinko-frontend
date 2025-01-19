import './map.css'

import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, GeoJSON, useMap, TileLayer } from 'react-leaflet';
import { polygon, centroid, featureCollection, feature } from "@turf/turf"; 

const centerSlovenia = [46.007, 14.856]; // Middle of Slovenia
const zoomSize = 8;

function findAdjacentObcine(targetFeature) {
    return fetch('../../sosednjeObcine.json')
        .then(response => response.json())
        .then(data => {
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

function ShowNearbyObcine({ allFeatures, targetFeature }) {
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
                    const adjacentLayer = L.geoJSON(feature, { style: { color: 'red', weight: 0.5 } });

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
            const features = [targetFeature, ...adjacentFeatures];

            const featCollection = featureCollection(features);
            
            const center = centroid(featCollection).geometry.coordinates;


            // Swap coordinate places because its reversed, why idk
            [center[0], center[1]] = [center[1], center[0]];

            return center;
        })  
        .catch(error => {
            console.error("Error getting center of obcin", error);
            return null;
        })
}

function ZoomOutSosednje({ allFeatures, feature }) {
    const map = useMap();

    useEffect(() => { 
        if (map) {
            getCenterOfObcin(allFeatures, feature) 
                .then(position => {
                    console.log(position) ;
                    map.flyTo(position, 10.3, { duration: 1.5 }); 
                })
        }

        else 
            console.log("Map is empty");
    }, []);

    return null;
}

// Zoom out to whole Slovenia
function ZoomOut({ position }) {
    const map = useMap();

    useEffect(() => { 
        if (map)
            map.flyTo(position, zoomSize, { duration: 1.5 }); 

        else 
            console.log("Map is empty");
    }, []);

    return null;
}

// Maybe change how to return because its really reduntant
export default function Map({ allFeatures, feature, showOutline, showMap, showNearbyObcine }) { 
    useEffect(() => {
        getCenterOfObcin(allFeatures, feature);
    }, []);

    if (showMap) {
        return (
            <MapContainer 
                // center={position}
                // zoom={zoomSize} 
                // scrollWheelZoom={true}
                // attributionControl={false}
                // zoomControl={false}
                // dragging={false}
                // doubleClickZoom={false}
            >

                {/* TODO: Remove names */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                <GeoJSON data={feature} style={{weight: 0.5}} />
                <FitToBounds feature={feature} />
                <ZoomOut position={centerSlovenia} />
            </MapContainer>
        )  
    }
    else if (showNearbyObcine) {
        return (
            <MapContainer 
                // center={position} 
                // zoom={zoomSize} 
                // scrollWheelZoom={false} 
                // style={{backgroundColor: "#090909"}}
                // attributionControl={false}
                // zoomControl={false}
                // dragging={false}
                // doubleClickZoom={false}
            >

                <GeoJSON data={feature} />
                <ShowNearbyObcine allFeatures={allFeatures} targetFeature={feature} />
                <ZoomOutSosednje allFeatures={allFeatures} feature={feature} />
            </MapContainer>
        )
    }
    else if (showOutline) {
        return (
            <MapContainer 
                center={centerSlovenia} 
                zoom={zoomSize} 
                scrollWheelZoom={true} 
                style={{backgroundColor: "#090909"}}
                attributionControl={false}
                zoomControl={true}
                dragging={true}
                doubleClickZoom={false}
            >

                <GeoJSON data={feature} />
                <FitToBounds feature={feature} />
            </MapContainer>
        )
    }
}