import accueil from "./accueil.js";
import niveau1 from "./niveau1.js";
import niveau2 from "./niveau2.js";
import niveau3 from "./niveau3.js";
import fin from "./fin.js";

var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,          // adapte le jeu à l'écran
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  backgroundColor: "#87ceeb",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [accueil, niveau1, niveau2, niveau3, fin]
};

var g = new Phaser.Game(config);

