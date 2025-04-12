import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { } from "leaflet";
import { FitToBoundsProps } from "../../../types/index";
import { config } from "../../../config/config";

const layerOptions = config.layerOptions;


export default function Outline({ feature, isAdjacent }: FitToBoundsProps) {
    const map = useMap();

    // Removes clipping 
    // https://github.com/Leaflet/Leaflet/issues/2814
    const renderer = L.canvas({ padding: 100 });
    map.getRenderer(renderer as L.Path).options.padding = 100;

    useEffect(() => {
        const geoJsonLayer: L.GeoJSON = L.geoJSON(feature, layerOptions);

        geoJsonLayer.addTo(map);
        
        // Only zoom in when it's only outline, no adjacent
        if (!isAdjacent) {
            map.fitBounds(geoJsonLayer.getBounds());
            map.setMaxBounds(geoJsonLayer.getBounds());   
        }

        return () => {
            map.removeLayer(geoJsonLayer);
        }
    }, [feature, map]);
  
    return null;
}