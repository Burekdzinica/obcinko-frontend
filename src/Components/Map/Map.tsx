import { useEffect } from "react";
import L, { featureGroup, LatLngTuple, layerGroup, map } from "leaflet";
import { MapContainer, GeoJSON, useMap, TileLayer } from 'react-leaflet';
import { Feature, Features ,RegionData, AdjacentObcineProps, FitToBoundsProps, MapProps } from "../../types/index";

import "leaflet/dist/leaflet.css";
import './map.css'

const centerSlovenia = [46.007, 14.856]; // Middle of Slovenia
const zoomSizeCenter = 8.5;

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

const tooltipOptions = {
    permanent: true,
    direction: "center" as L.Direction
};

const Options = {
    ADJACENT: "ADJACENT" as const,
    CENTER: "CENTER" as const,
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

function changeTooltipFontSize() {
    const tooltips = document.querySelectorAll(".leaflet-tooltip");
    
    tooltips.forEach(tooltip => {
        const element = tooltip as HTMLElement;
        element.style.fontSize = "9px";
    });
}

function WholeMap() {
    const map = useMap();

    useEffect(() => {
        map.flyTo(centerSlovenia as LatLngTuple, zoomSizeCenter, { duration: 0.25 });

        changeTooltipFontSize();
    }, []);

    return null;
}

function AdjacentObcine({ options, allFeatures, targetFeature }: AdjacentObcineProps) {
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
                map.fitBounds(featureGroup.getBounds());
            }
        }

        addToMap();

        // Clean the map from featureGroup
        return () => {
            map.removeLayer(featureGroup);
        }

    }, [allFeatures, targetFeature]);

    return null;
}

function Outline({ feature }: FitToBoundsProps) {
    const map = useMap();

    // Removes clipping 
    // https://github.com/Leaflet/Leaflet/issues/2814
    const renderer = L.canvas({ padding: 100 });
    map.getRenderer(renderer as L.Path).options.padding = 100;

    useEffect(() => {
        const geoJsonLayer: L.GeoJSON = L.geoJSON(feature);

        map.fitBounds(geoJsonLayer.getBounds());    
    }, [feature, map]);
  
    return null;
}

function mapView({ allFeatures, feature, hints, showSatellite }: MapProps) {
    let mapContent;

    switch (true) {
        case showSatellite:
            mapContent = (
                <MapContainer {...mapOptions}>
                    <TileLayer
                        url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="https://server.arcgisonline.com/arcgis/rest/services">ArcGIS</a>'
                    />
                    <GeoJSON data={feature} />
                </MapContainer>
            );  
            break;

        case hints.map:
            mapContent = (
                <MapContainer {...mapOptions}>
                    <TileLayer
                        // https://github.com/CartoDB/basemap-styles?tab=readme-ov-file
                        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    />
                    <GeoJSON data={feature} style={{weight: 0.5}} />
                    <AdjacentObcine options={Options.CENTER} allFeatures={allFeatures} targetFeature={feature} />
                    <WholeMap />
                </MapContainer>
            );
            break;

        case hints.adjacentObcine:
            mapContent = (
                <MapContainer {...mapOptions}>
                    <GeoJSON data={feature} />
                    <AdjacentObcine options={Options.ADJACENT} allFeatures={allFeatures} targetFeature={feature} />
                </MapContainer>
            );
            break;

        case hints.outline:
            mapContent = (
                <MapContainer {...mapOptions}>
                    <GeoJSON data={feature} />
                    <Outline feature={feature} />
                </MapContainer> 
            );
            break;
    }

    return mapContent;
}

// Maybe change how to return because its really reduntant
export default function Map({ allFeatures, feature, hints, showSatellite }: MapProps) {
    let mapContent = mapView({allFeatures, feature, hints, showSatellite});

    return mapContent;
}