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

export default function Map({ allFeatures, feature, hints, showSatellite }: MapProps) {
    let mapContent;
    let satelliteContent;
    let wholeMapContent;
    let adjacentObcineContent;

    if (showSatellite) {
        satelliteContent = (
            <TileLayer
                // https://github.com/CartoDB/basemap-styles?tab=readme-ov-file
                url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://server.arcgisonline.com/arcgis/rest/services">ArcGIS</a>'
            />
        );
    }

    if (hints.map) {
        wholeMapContent = (
            <WholeMap />
        );
    }

    if (hints.adjacentObcine) {
        adjacentObcineContent = (
            <AdjacentObcine 
                options={Options.ADJACENT} 
                allFeatures={allFeatures} 
                targetFeature={feature} 
            />
        )
    }

    mapContent = (
        <MapContainer {...mapOptions}>
            {satelliteContent}
            <Outline feature={feature} />
            {adjacentObcineContent}
            {wholeMapContent}
        </MapContainer>
    )

    return mapContent;
}