import { useEffect } from "react";
import L, { LatLngTuple } from "leaflet";
import { MapContainer, GeoJSON, useMap, TileLayer } from 'react-leaflet';
import { center, centroid, featureCollection, bbox } from "@turf/turf"; 
import { Feature, Features ,RegionData, AdjacentObcineProps, FitToBoundsProps, MapProps, ZoomOutProps } from "../../types/index";

import "leaflet/dist/leaflet.css";
import './map.css'

const centerSlovenia = [46.007, 14.856]; // Middle of Slovenia

const zoomSizeCenter = 8.5;
const zoomSizeAdjacent = 10.7;

const Options = {
    ADJACENT: "ADJACENT" as const,
    CENTER: "CENTER" as const,
};

// Styles
const mapOptions = {
    scrollWheelZoom: true,
    attributionControl: false,
    zoomControl: true,
    dragging: true,
    doubleClickZoom: false,
    style: { backgroundColor: "#090909" },
};

const adjacentObcineOptions = {
    style: {
        color: "rgb(166, 245, 245)",
        weight: 0.5
    }
};

// Return list of adjacent obcine naziv from sosednjObcine json
async function findAdjacentObcine(targetFeature: Feature) {
    try {
        const response = await fetch('../../jsons/sosednjeObcine.json');
        const obcine: RegionData = await response.json();

        if (!targetFeature.properties) {
            console.log("Target feature is empty");
            return;
        }

        const targetObcina = targetFeature.properties.NAZIV;
        const adjacentObcine = obcine[targetObcina];

        return adjacentObcine;
    }
    catch (error) {
        console.error("Error loading sosednjeObcine.json: ", error)
        return;
    }
}

// Return list of features of adjacent obcine
async function findAdjacentFeatures(allFeatures: Features, targetFeature: Feature) {
    const adjacentObcine = await findAdjacentObcine(targetFeature);

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

function ShowAdjacentObcine({ allFeatures, targetFeature }: AdjacentObcineProps) {
    const map = useMap();

    async function addToMap() {
        const adjacentFeatures =  await findAdjacentFeatures(allFeatures, targetFeature);

        if (!adjacentFeatures) {
            console.error("Adjacent features is empty");
            return;
        }
    
        adjacentFeatures.forEach(feature => {
            const adjacentLayer = L.geoJSON(feature, 
                { ...adjacentObcineOptions,

                // Add naziv to every adjacent obcina
                onEachFeature: (feature: Feature, layer: L.Layer) => {
                    if (!feature.properties) {
                        console.error("Feature properties is empty");
                        return;
                    }

                    // Bind obcine naziv to tooltip
                    layer.bindTooltip(feature.properties.NAZIV, {
                        permanent: true,
                        direction: "center"                                
                    });
                }, 
            }); 

            map.addLayer(adjacentLayer);
            map.fitBounds(adjacentLayer.getBounds());
        });
    }

    useEffect(() => {
        addToMap();
    }, [allFeatures, targetFeature]);

    return null;
}

async function getCenterOfObcin(allFeatures: Features, targetFeature: Feature) {
    const adjacentFeatures = await findAdjacentFeatures(allFeatures, targetFeature);
    
    if (!adjacentFeatures) {
        console.error("Adjacent features is empty");
        return;
    }

    const features = [targetFeature, ...adjacentFeatures]; // combine all features
    const featCollection = featureCollection(features);

    const center = centroid(featCollection).geometry.coordinates;
    
    // Swap coordinate places because its reversed, why, idk
    [center[0], center[1]] = [center[1], center[0]];

    return center;
}

// Change naziv font size
function changeTooltipFontSize() {
    const tooltips = document.querySelectorAll(".leaflet-tooltip");

    tooltips.forEach(tooltip => {
        const element = tooltip as HTMLElement;
        element.style.fontSize = "9px";
    });
}

function ZoomOut({ options, allFeatures, feature }: ZoomOutProps) {
    const map = useMap();

    async function zoomAdjacent() {
        if (!allFeatures) {
            console.log("All features are empty");
            return;
        }

        if (!feature) {
            console.log("Feature is empty");
            return;
        }

        const centerOfObcin = await getCenterOfObcin(allFeatures, feature);

        if (!centerOfObcin) {
            console.log("Center of obcin are empty");
            return;
        }

        const latLng = centerOfObcin as LatLngTuple;
        map.flyTo(latLng, zoomSizeAdjacent, { duration: 0.25 });

        


    
        // map.fitBounds(centerOfObcin);

        // Use fitToBounds, flyTo for centering ???
    }

    function zoomCenter() {
        map.flyTo(centerSlovenia as LatLngTuple, zoomSizeCenter, { duration: 0.25 });
    }

    useEffect(() => {
        switch (options) {
            case Options.ADJACENT:
                zoomAdjacent();
                break;
            
            case Options.CENTER:
                zoomCenter();
                changeTooltipFontSize();
                break;
        }
    }, [options, allFeatures, feature]);

    return null;
}

// TODO: this useles just make .fitBounds ?
// Fit obcina to map center
function FitToBounds({ feature }: FitToBoundsProps) {
    const map = useMap();

    // Removes clipping 
    // https://github.com/Leaflet/Leaflet/issues/2814
    const renderer = L.canvas({ padding: 100 });
    map.getRenderer(renderer as L.Path).options.padding = 100;

    useEffect(() => {
        if (!feature) {
            console.log("Feature is empty");
            return;
        }

        const geoJsonLayer: L.GeoJSON = L.geoJSON(feature);

        map.fitBounds(geoJsonLayer.getBounds());    
    }, [feature, map]);
  
    return null;
}

// Maybe change how to return because its really reduntant
export default function Map({ allFeatures, feature, hints, showSatellite }: MapProps) {
    if (showSatellite) {
        return (
            <MapContainer {...mapOptions}>
                <TileLayer
                    url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://server.arcgisonline.com/arcgis/rest/services">ArcGIS</a>'
                />
                <GeoJSON data={feature} />
                <FitToBounds feature={feature} />
            </MapContainer>
        )  
    } 
    else if (hints.map) {
        return (
            <MapContainer {...mapOptions}>
                <TileLayer
                    // https://github.com/CartoDB/basemap-styles?tab=readme-ov-file
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
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
                {/* <FitToBounds feature={feature} /> */}
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