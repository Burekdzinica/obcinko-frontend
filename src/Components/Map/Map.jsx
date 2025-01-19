import './map.css'

import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, GeoJSON, useMap, TileLayer } from 'react-leaflet';
import { polygon, intersect, featureCollection, difference, booleanIntersects } from "@turf/turf"; 

const position = [46.007, 14.856]; // Middle of Slovenia
const zoomSize = 8;

function findAdjacentFeatures(targetFeature, allFeatures) {
    let adjacentFeatures = [];
    
    const targetCoordinates = targetFeature.geometry.coordinates[0];
    let targetPolygon = polygon([targetCoordinates]);

    // Push adjacent polygons to list
    allFeatures.forEach(feature => {
        // skip targetFeature
        if (feature == targetFeature)
            return;

        
        let featureCoordinates = feature.geometry.coordinates[0];
        let currentPolygon = polygon([featureCoordinates]);


        // console.log("diff " + difference(featureCollection([targetPolygon, currentPolygon])));
        // console.log("inter " + intersect(featureCollection([targetPolygon, currentPolygon])));

        // if (intersect(featureCollection([targetPolygon, currentPolygon])))
        //     adjacentFeatures.push(feature);

        // const diff = difference(featureCollection([targetPolygon, currentPolygon]));
        // console.log(diff);

        // if (diff == 0) {
        //     adjacentFeatures.push(feature);
        // }

        if (booleanIntersects(targetPolygon, currentPolygon))
            adjacentFeatures.push(feature);

    })

    console.log(adjacentFeatures);

    return adjacentFeatures;
}

function ShowNearbyObcine({ feature, allFeatures }) {
    const map = useMap();

    useEffect(() => {
        if (!feature) {
            console.error("Feature is empty: showNearbyObcine");
            return;
        }

        const adjacentFeatures = findAdjacentFeatures(feature, allFeatures);

        // add to layer adjacent features
        adjacentFeatures.forEach(currentFeature => {
            const adjacentLayer = L.geoJSON(currentFeature, { style: { color: 'red'}, weight: 0.5 });

            map.addLayer(adjacentLayer);
            map.fitBounds(adjacentLayer.getBounds());
        })
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

// Zoom out to whole Slovenia
function ZoomOut() {
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
                <ZoomOut />
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
                <ShowNearbyObcine feature={feature} allFeatures={allFeatures} />
            </MapContainer>
        )
    }
    else if (showOutline) {
        return (
            <MapContainer 
                center={position} 
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

// https://stackoverflow.com/questions/59413255/how-to-find-adjacent-polygons-in-leaflet