export default function Game() {
    const obcinaOfTheDay = "koper";

    let obcinaGuess = document.getElementById("obcinaInput").value;
    console.log(obcinaGuess);    

    if (obcinaGuess.toLowerCase() === obcinaOfTheDay.toLowerCase()) {
        console.log("Correct!");
    } 
    else {
        console.log("Try again!");
    }
   
   return null;
}
