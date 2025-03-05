import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { } from "leaflet";
import { config } from "../../../config/config";

const sloveniaBounds = L.latLngBounds(config.sloveniaBounds);
const boundsOptions = config.boundsOptions;

export default function WholeMap() {
    const map = useMap();
    // map.setMaxBounds(sloveniaBounds);

    useEffect(() => {
        map.flyToBounds(sloveniaBounds, boundsOptions);

    }, [map]);

    return null;
}