export interface Config {
    mapOptions: MapOptions;
    adjacentObcineOptions: AdjacentObcineOptions;
    boundsOptions: BoundsOptions;
}

interface MapOptions {
    scrollWheelZoom: boolean;
    attributionControl: boolean;
    zoomControl: boolean;
    dragging: boolean;
    doubleClickZoom: boolean;
    style: { backgroundColor: string };
    maxZoom: number;
    minZoom: number;
}

interface AdjacentObcineOptions {
    style: { 
        color: string; 
        weight: number 
    };
}

interface BoundsOptions {
    duration: number;   
}
