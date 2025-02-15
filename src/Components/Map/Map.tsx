import { MapContainer, GeoJSON, TileLayer, useMapEvent } from 'react-leaflet';
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


// Need this ????????
// function changeTooltipFontSize(em: string) {
//     const tooltips = document.querySelectorAll(".leaflet-tooltip");

//     em = em + "em";
    
//     tooltips.forEach(tooltip => {
//         const element = tooltip as HTMLElement;
//         element.style.transition = "font-size 2 ease-in-out";
//         element.style.fontSize = em;
//     });
// }

// // Change tooltip based on zoom levels
// function ChangeTooltipSize() {
//     const map = useMapEvent("zoomend", () => {
//         const zoomLevel = map.getZoom();

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
                    {/* <ChangeTooltipSize /> */}
                    <Outline feature={feature} />
                    <AdjacentObcine options={Options.CENTER} allFeatures={allFeatures} targetFeature={feature} />
                    <WholeMap />
                </MapContainer>
            );
            break;

        case hints.adjacentObcine:
            mapContent = (
                <MapContainer {...mapOptions}>
                    {satelliteContent}
                    {/* <ChangeTooltipSize /> */}
                    <Outline feature={feature} />
                    <AdjacentObcine options={Options.ADJACENT} allFeatures={allFeatures} targetFeature={feature} />
                </MapContainer>
            );
            break;

        case hints.outline:
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