// https://confetti.js.org/more.html
import { confetti } from '@tsparticles/confetti';

// Fix for map -_> z index

// Grbi al zastave??
// local or https ?
export default async function launchConfetti() {
  await confetti({
    spread: 360,
    ticks: 50,
    gravity: 1,
    decay: 0.94,
    startVelocity: 60,
    particleCount: 300,
    scalar: 3,
    zIndex: 1000,
    shapes: ["image"],
    shapeOptions: {
      // https://sl.wikipedia.org/wiki/Seznam_ob%C4%8Din_v_Sloveniji
      image: [
        {
          src: "res/confetti/grbi/ljubljana.png",
          width: 32,
          height: 32,
        },
        {
          src: "res/confetti/grbi/dobje.png",
          width: 32,
          height: 32,
        },
        {
          src: "res/confetti/grbi/maribor.png",
          width: 32,
          height: 32,
        },
        {
          src: "res/confetti/grbi/kranj.png",
          width: 32,
          height: 32,
        },
        {
          src: "res/confetti/grbi/celje.png",
          width: 32,
          height: 32,
        },  
        {
          src: "res/confetti/zastave/ljubljana.png",
          width: 32,
          height: 32,
        },
        {
          src: "res/confetti/zastave/maribor.png",
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