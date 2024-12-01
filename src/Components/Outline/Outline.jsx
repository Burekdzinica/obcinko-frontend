import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, GeoJSON, useMap} from 'react-leaflet';


const position = [46.007, 14.856];
const zoomSize = 8;

function FitToBounds({ feature }) {
  const map = useMap();
  console.log(feature);

  useEffect(() => {
      if (feature) {
          const geoJsonLayer = L.geoJSON(feature);
          map.fitBounds(geoJsonLayer.getBounds());
      }
  }, [feature, map]);

  return null;
}

export default function Outline(feature) {
  const obcinaFeature = feature.feature;

  return (
    <MapContainer center={position} zoom={zoomSize} scrollWheelZoom={false} style={{backgroundColor: "black"}}>
      <GeoJSON data={obcinaFeature} />
      <FitToBounds feature={obcinaFeature} />
    </MapContainer>
  )

  // const mapRef = useRef(null);
  
  // useEffect(() => {
  //   // Initialize map
  //   const bounds = [[45.42, 13.37], [46.88, 16.6]]; // Southwest and Northeast corners of Slovenia
  //   const map = L.map(mapRef.current, {
  //     center: [46.1512, 14.9955], // Slovenia's center
  //     zoom: 9.1,
  //     maxBounds: bounds,
  //     maxBoundsViscosity: 1.0,
  //   });

    
  //   console.log("Outline: ")
  //   console.log(obcinaFeature);
    
  //           const obcinaFeature = feature.feature;
  //           const geoJsonLayer = L.geoJSON(obcinaFeature).addTo(map);
  //           map.fitBounds(geoJsonLayer.getBounds());

  //   return () => {
  //     // Cleanup on unmount
  //     map.remove();
  //   };
  // }, []);

  //   return <div ref={mapRef} style={{backgroundColor: "black"}} />;
};