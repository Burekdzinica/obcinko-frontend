import { polygon, booleanIntersects } from "@turf/turf"; 
import { Feature, Features } from "../types";
import { json } from "express";

// https://www.amitmerchant.com/create-and-download-text-files-using-javascript/
function saveTextAsFile(textToWrite: any, fileNameToSaveAs: string, fileType: string) {
    let textFileAsBlob = new Blob([textToWrite], { type: fileType });
    let downloadLink = document.createElement('a');

    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = 'Download File';

    if (window.webkitURL != null) {
        downloadLink.href = window.webkitURL.createObjectURL(
            textFileAsBlob
        );
    } 
    else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();

    if (downloadLink.href) {
        console.log('Download triggered for:', fileNameToSaveAs);
    } 
    else {
        console.error('Download link is not working');
    }
}

async function fetchObcineNaziv() {
    try {
        const response = await fetch("./jsons/obcine.json");
        const data = await response.json();

        if (!data) {
            console.log("Data is empty");
            return;
        }

        let obcine: string[] = [];
        const features: Features = data.features;
        

        features.forEach(feature => {
            if (!feature.properties) {
                console.error("Feature properties are empty");
                return;
            }

            // obcine.push(feature.id as string); // ID
            obcine.push(feature.properties.NAZIV as string); // Naziv
        })
        
        return obcine;
    }
    catch (error) {
        console.error("Error loading obcine.json: ", error);
        return;
    }
}

// Shuffle list
// https://bost.ocks.org/mike/shuffle/
function shuffle(array: string[]) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
}

function formatObcine(obcine: string[], startDate: string) {
    let formattedObcine: Record<string, string> = {};

    for (let i = 0; i < obcine.length; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i); // increment day

        let dateJson = date.toISOString().split('T')[0];
        formattedObcine[dateJson] = obcine[i]; 
    }

    return formattedObcine;
}


// Write obcine to file for daily guesses
export async function writeObcineToFile() {
    const obcine = await fetchObcineNaziv();

    if (!obcine) {
        console.log("Obcine are empty");
        return;
    }

    const combinedObcine: string[] = [];
    const startDate = "2025-3-2";
    
    /*
        Obcine: 212
        Generate n * 212 obcin
        5 * 212 = 1060 days = 5.8 years
    */
   const n = 5;
   for (let i = 0; i < n; i++) {
       let shuffledObcine: string[] = shuffle(obcine);

       combinedObcine.push(...shuffledObcine); // flatten array
    }
    const formattedObcine = formatObcine(combinedObcine, startDate);
    saveTextAsFile(JSON.stringify(formattedObcine, null, 4), "daily.json", "application/json");

    // saveTextAsFile(JSON.stringify(combinedObcine, null, 4), "daily.json", "application/json");
    // saveTextAsFile(combinedObcine.join("\n"), "dailies.txt", "txt");
}







// Dowload json file to dowloads
function dowloadJson(data: any, filename: string) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

// Write ALL adjacent obcine for every obcina and dowload it
export function writeAdjacentObcineToFile(allFeatures: Features) {
    const list: any = {};

    allFeatures.forEach((targetFeature: any) => {
        const targetNaziv = targetFeature.properties?.NAZIV;
        const targetCoordinates = targetFeature.geometry.coordinates[0];
        const targetPolygon = polygon([targetCoordinates]);

        list[targetNaziv] = [];

        allFeatures.forEach((feature: any) => {
            if (feature == targetFeature) 
                return;

            const featureNaziv = feature.properties?.NAZIV;
            const featureCoordinates = feature.geometry.coordinates[0];
            const currentPolygon = polygon([featureCoordinates]);

            if (booleanIntersects(currentPolygon, targetPolygon))
                list[targetNaziv].push(featureNaziv);
        });
    });

    let x = JSON.stringify(list, null, 2);

    dowloadJson(x, "sosednjeObcine.json");
}

// Remove whitespaces, cases and šumniks
export function normalizeText(text: string) {
    // Remove whitespaces
    text = text.trim();

    // Remove whitespace between "-"
    text = text.replace(/\s+-\s+/g, '-');

    // Case & šumnik insensitive
    text = text.toLowerCase().replace(/[čšž]/g, match => ({ č: 'c', š: 's', ž: 'z' })[match] ?? match);

    return text;
}

export async function getFeatureFromNaziv(features: Features, naziv: string) {
    return features.find((feature) => feature.properties?.NAZIV === naziv);
}
