import { LatLngTuple } from "leaflet";

export const config = {
    mapOptions: {
        maxZoom: 20,
        minZoom: 8,
        scrollWheelZoom: true,
        attributionControl: false,
        zoomControl: true,
        dragging: true,
        doubleClickZoom: false,
        style: { backgroundColor: "#090909" },
    },
    sloveniaBounds: [
        [45.42222, 13.37556] as LatLngTuple,
        [46.87667, 16.61056] as LatLngTuple
    ],
    adjacentObcineOptions: {
        style: {
            color: "rgb(166, 245, 245)",
            weight: 0.2
        }
    },
    boundsOptions: {
        duration: 0.25
    },
    tooltipOptions: {
        permanent: true,
        direction: "center" as L.Direction
    },
    layerOptions: {
        style: {
            weight: 2
        }
    },
    gameStateDefault:  {
        solution: "",
        feature: null,
        numberOfGuesses: 1,
        showSatellite: false,
        win: false,
        lose: false,
        hints: {
            outline: false,
            region: false,
            adjacentObcine: false,
            map: false
        }
    },
    statsDefault: {
        playedGames: 0,
        wins: 0,
        winProcentile: 0,
        streak: 0,
        maxStreak: 0
    }
};
