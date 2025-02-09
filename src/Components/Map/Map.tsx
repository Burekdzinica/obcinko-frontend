import { useEffect } from "react";
import L, { } from "leaflet";
import { MapContainer, GeoJSON, useMap, TileLayer, useMapEvent } from 'react-leaflet';
import { Feature, Features ,RegionData, AdjacentObcineProps, FitToBoundsProps, MapProps } from "../../types/index";

import rawConfig from "../../config/config.json";
import { Config } from "../../config/config";

import "leaflet/dist/leaflet.css";
import './map.css'

const config: Config = rawConfig;
const mapOptions = config.mapOptions;
const adjacentObcineOptions = config.adjacentObcineOptions;
const boundsOptions = config.boundsOptions;

const sloveniaBounds = L.latLngBounds(
    [45.42222, 13.37556], // Southwest corner
    [46.87667, 16.61056]  // Northeast corner
);

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

// Need this ????????

// function changeTooltipFontSize(em: string) {
//     const tooltips = document.querySelectorAll(".leaflet-tooltip");

//     em = em + "em";
    
//     tooltips.forEach(tooltip => {
//         const element = tooltip as HTMLElement;
//         element.style.transition = "font-size 0.2 ease";
//         element.style.fontSize = em;
//     });
// }

// // Change tooltip based on zoom levels
// function ChangeTooltipSize() {
//     const map = useMapEvent("zoomend", () => {
//         const zoomLevel = map.getZoom();

//         console.log(zoomLevel);
//         switch (zoomLevel) {
//             case 8:
//                 changeTooltipFontSize("0.5");
//                 break;
//             case 9:
//                 changeTooltipFontSize("0.7");
//                 break;
//             case 10:
//                 changeTooltipFontSize("0.9");
//                 break;
//             case 11:
//                 changeTooltipFontSize("1.1");
//                 break;
//             case 12:
//                 changeTooltipFontSize("1.3");
//                 break;
//             case 13:
//                 changeTooltipFontSize("1.5");
//                 break;
//             default:
//                 changeTooltipFontSize("1");
//                 break;
//         }
//     });

//     return null;
// }

function WholeMap() {
    const map = useMap();

    useEffect(() => {
        map.flyToBounds(sloveniaBounds, boundsOptions);
    }, [map]);

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
                map.flyToBounds(featureGroup.getBounds(), boundsOptions);
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

function Outline({ feature }: FitToBoundsProps) {
    const map = useMap();

    // Removes clipping 
    // https://github.com/Leaflet/Leaflet/issues/2814
    const renderer = L.canvas({ padding: 100 });
    map.getRenderer(renderer as L.Path).options.padding = 100;

    useEffect(() => {
        const geoJsonLayer: L.GeoJSON = L.geoJSON(feature);

        map.fitBounds(geoJsonLayer.getBounds());   
        // map.flyToMap(geoJsonLayer.getBounds(), boundsOptions); 
    }, [feature, map]);
  
    return null;
}

function mapView({ allFeatures, feature, hints, showSatellite }: MapProps) {
    let mapContent;
    let satelliteContent;

    if (showSatellite) {
        satelliteContent = (
            <TileLayer
                url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://server.arcgisonline.com/arcgis/rest/services">ArcGIS</a>'
            />
        );
    }

    switch (true) {
        case hints.map:
            mapContent = (
                <MapContainer {...mapOptions}>
                    {/* Change tile layer based on satellite */}
                    {showSatellite ? (satelliteContent) : 
                        <TileLayer
                            // https://github.com/CartoDB/basemap-styles?tab=readme-ov-file
                            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        />
                    }
                    <GeoJSON data={feature} style={{weight: 0.5}} />
                    {/* <ChangeTooltipSize /> */}
                    <AdjacentObcine options={Options.CENTER} allFeatures={allFeatures} targetFeature={feature} />
                    <WholeMap />
                </MapContainer>
            );
            break;

        case hints.adjacentObcine:
            mapContent = (
                <MapContainer {...mapOptions}>
                    {satelliteContent}
                    <GeoJSON data={feature} />
                    {/* <ChangeTooltipSize /> */}
                    <AdjacentObcine options={Options.ADJACENT} allFeatures={allFeatures} targetFeature={feature} />
                </MapContainer>
            );
            break;

        case hints.outline:
            mapContent = (
                <MapContainer {...mapOptions}>
                    {satelliteContent}
                    <GeoJSON data={feature} />
                    <Outline feature={feature} />
                </MapContainer> 
            );
            break;
    }

    return mapContent;
}

export default function Map({ allFeatures, feature, hints, showSatellite }: MapProps) {
    let mapContent = mapView({allFeatures, feature, hints, showSatellite});

    return mapContent;
}