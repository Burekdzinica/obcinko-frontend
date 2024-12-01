import './map.css'

import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, GeoJSON, useMap, TileLayer } from 'react-leaflet';


const position = [46.007, 14.856]; // Middle of Slovenia
let zoomSize = 8;

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

// Zoom out to whole Slovenia
function ZoomOut() {
    const map = useMap();
    useEffect(() => { map.flyTo(position, zoomSize); }, []);

    return null;
}

export default function Map({ feature, showOutline, showMap }) {    
    if (showMap) {
        return (
            <MapContainer 
                center={position} 
                zoom={zoomSize} 
                scrollWheelZoom={true}
                attributionControl={false}
                zoomControl={false}
                dragging={false}
            >

                {/* TODO: Remove names */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                <GeoJSON data={feature} style={{weight: 0.5}} />
                <FitToBounds feature={feature} />
                <ZoomOut />
            </MapContainer>
        )  
    }
    else if (showOutline) {
        return (
            <MapContainer 
                center={position} 
                zoom={zoomSize} 
                scrollWheelZoom={false} 
                style={{backgroundColor: "#090909"}}
                attributionControl={false}
                zoomControl={false}
                dragging={false}
            >

                <GeoJSON data={feature} />
                <FitToBounds feature={feature} />
            </MapContainer>
        )
    }
}