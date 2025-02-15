import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { } from "leaflet";
import { FitToBoundsProps } from "../../../types/index";


export default function Outline({ feature }: FitToBoundsProps) {
    const map = useMap();

    // Removes clipping 
    // https://github.com/Leaflet/Leaflet/issues/2814
    const renderer = L.canvas({ padding: 100 });
    map.getRenderer(renderer as L.Path).options.padding = 100;

    useEffect(() => {
        const geoJsonLayer: L.GeoJSON = L.geoJSON(feature);

        map.fitBounds(geoJsonLayer.getBounds());
        map.setMaxBounds(geoJsonLayer.getBounds());   
    }, [feature, map]);
  
    return null;
}