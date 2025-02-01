// https://confetti.js.org/more.html
import { confetti } from '@tsparticles/confetti';

// Fix for map -_> z index

// Grbi al zastave??
// local or https ?
export default async function launchConfetti() {
  await confetti({
    spread: 360,
    ticks: 100,
    gravity: 1,
    decay: 0.94,
    startVelocity: 30,
    particleCount: 300,
    scalar: 4,
    // zIndex: 9999,
    shapes: ["image"],
    shapeOptions: {
      // https://sl.wikipedia.org/wiki/Seznam_ob%C4%8Din_v_Sloveniji
      image: [
        // Grbi
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Blason_ville_si_Ljubljana_%28Slov%C3%A9nie%29.svg/800px-Blason_ville_si_Ljubljana_%28Slov%C3%A9nie%29.svg.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/5/51/DobjeGrb.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Coat_of_arms_of_Maribor_%282020%29.svg/1024px-Coat_of_arms_of_Maribor_%282020%29.svg.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Coat_of_arms_of_Kranj_%28with_white_outline%29.svg/1024px-Coat_of_arms_of_Kranj_%28with_white_outline%29.svg.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Coat_of_arms_of_Celje.svg/800px-Coat_of_arms_of_Celje.svg.png",
          width: 32,
          height: 32,
        },  
        // Zastave
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Flag_of_Ljubljana.svg/1920px-Flag_of_Ljubljana.svg.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Maribor_%282020%29.svg/1920px-Flag_of_Maribor_%282020%29.svg.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/0/03/Zastava_Mestne_ob%C4%8Dine_Kranj.jpg",
          width: 32,
          height: 32,
        },
      ],
    },
  });
};