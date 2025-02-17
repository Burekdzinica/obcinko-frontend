export type GeoJsonProps = GeoJSON.GeoJsonProperties;
export type Features = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[];
export type Feature = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;


export interface GameState {
    obcina: string;
    numberOfGuesses: number;
    obcinaFeature: Feature;
    showSatellite: boolean;
    win: boolean;
    lose: boolean;
    hints: {
        outline: boolean;
        region: boolean;
        adjacentObcine: boolean;
        map: boolean;
    };
}

export interface Stats {
    playedGames: number;
    wins: number;
    winProcentile: number;
    streak: number;
    maxStreak: number;
}