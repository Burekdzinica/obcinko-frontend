import './map.css'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import CustomSVG from './SVG';

const position = [46.007, 14.856];
const zoomSize = 8;

export default function Map() {
    return (
        <MapContainer center={position} zoom={zoomSize} scrollWheelZoom={true}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CustomSVG />
        </MapContainer>
    )
}