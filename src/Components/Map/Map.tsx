import { MapContainer, TileLayer } from 'react-leaflet';
import { MapProps } from "../../types/index";
import Outline from "./Outline/Outline";
import AdjacentObcine from "./AdjacentObcine/AdjacentObcine";
import WholeMap from "./WholeMap/WholeMap";

import { config } from "../../config/config";
import { useEffect, useState } from 'react';

import "leaflet/dist/leaflet.css";
import './map.css'

const mapOptions = config.mapOptions;

const Options = {
    ADJACENT: "ADJACENT" as const,
    CENTER: "CENTER" as const,
};

export default function Map({ allFeatures, feature, hints, showSatellite }: MapProps) {
    const [isAdjacent, setIsAdjacent] = useState(false);

    // Cycles through isAdjacent, false -> true, true -> false
    useEffect(() => {
        setIsAdjacent(!!isAdjacent);
    }, [hints.adjacentObcine])

    
    return (
        <MapContainer {...mapOptions}>
            {/* Satellite layer and normal map layer */}
            {showSatellite ? (
                <TileLayer
                    url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://server.arcgisonline.com/arcgis/rest/services">ArcGIS</a>'
                />
            ) : hints.map && (
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
            )}

            <Outline 
                feature={feature} 
                isAdjacent={isAdjacent}
            />

            { hints.adjacentObcine && (
               <AdjacentObcine 
                    options={Options.ADJACENT} 
                    allFeatures={allFeatures} 
                    targetFeature={feature} 
                /> 
            )}

            { hints.map && (
                <WholeMap />
            )}
        </MapContainer>
    )
}