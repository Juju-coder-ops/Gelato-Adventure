import accueil from "./accueil.js";
import niveau1 from "./niveau1.js";

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
      debug: true
    }
  },
  scene: [accueil, niveau1]
};

var g = new Phaser.Game(config);

