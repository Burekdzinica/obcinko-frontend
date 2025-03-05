import { Feature, Features } from "./game";

export interface Hints {
    region: boolean;
    adjacentObcine: boolean;
    map: boolean;
    satellite: boolean;
}

export interface AdjacentObcineProps {
    options: "ADJACENT" | "CENTER";    
    allFeatures: Features;
    targetFeature: Feature;
}

export interface FitToBoundsProps {
    feature: Feature;
}

export interface MapProps {
    allFeatures: Features;
    feature: Feature;
    hints: Hints;
    showSatellite: boolean;
}
