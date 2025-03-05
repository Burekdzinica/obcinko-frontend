import { MapContainer, TileLayer } from 'react-leaflet';
import { MapProps } from "../../types/index";
import Outline from "./Outline/Outline";
import AdjacentObcine from "./AdjacentObcine/AdjacentObcine";
import WholeMap from "./WholeMap/WholeMap";

import { config } from "../../config/config";

import "leaflet/dist/leaflet.css";
import './map.css'

const mapOptions = config.mapOptions;

const Options = {
    ADJACENT: "ADJACENT" as const,
    CENTER: "CENTER" as const,
};

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
                    <Outline feature={feature} />
                    <AdjacentObcine 
                        options={Options.CENTER} 
                        allFeatures={allFeatures} 
                        targetFeature={feature} 
                    />
                    <WholeMap />
                </MapContainer>
            );
            break;

        case hints.adjacentObcine:
            mapContent = (
                <MapContainer {...mapOptions}>
                    {satelliteContent}
                    <Outline feature={feature} />
                    <AdjacentObcine 
                        options={Options.ADJACENT} 
                        allFeatures={allFeatures} 
                        targetFeature={feature} 
                    />
                </MapContainer>
            );
            break;

        case true:
            mapContent = (
                <MapContainer {...mapOptions}>
                    {satelliteContent}
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