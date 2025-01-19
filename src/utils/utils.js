import { polygon, intersect, featureCollection, difference, booleanIntersects, center } from "@turf/turf"; 


// Dowload json file to dowloads
function dowloadJson(data, filename) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

// Write ALL adjacent obcine for every obcina and dowload it
function writeAdjacentObcineToFile(allFeatures) {
    const list = {};

    allFeatures.forEach(targetFeature => {
        const targetNaziv = targetFeature.properties.NAZIV;
        const targetCoordinates = targetFeature.geometry.coordinates[0];
        const targetPolygon = polygon([targetCoordinates]);

        list[targetNaziv] = [];

        allFeatures.forEach(feature => {
            if (feature == targetFeature) 
                return;

            const featureNaziv = feature.properties.NAZIV;
            const featureCoordinates = feature.geometry.coordinates[0];
            const currentPolygon = polygon([featureCoordinates]);

            if (booleanIntersects(currentPolygon, targetPolygon))
                list[targetNaziv].push(featureNaziv);
        });
    });

    let x = JSON.stringify(list, null, 2);

    dowloadJson(x, "sosednjeObcine.json");
}