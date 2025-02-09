import { Feature, Features } from "./game";

export interface Hints {
    outline: boolean;
    region: boolean;
    adjacentObcine: boolean;
    map: boolean;
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
