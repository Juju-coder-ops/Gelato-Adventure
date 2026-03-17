
export default class accueil extends Phaser.Scene {

 constructor() {
    super({
      key: "accueil" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }

 preload() {
}

 create() {
    this.add.text(150, 200, "Bienvenue sur Gelato Adventure", {
        fontSize: "40px",
        fill: "#000"
    });

    var boutonJouer = this.add.text(350, 300, "Jouer", {
        fontSize: "32px",
        fill: "#fff",
        backgroundColor: "#000",
        padding: { x: 20, y: 10 }
    }).setInteractive();

    boutonJouer.on("pointerdown", () => {
        lancerLeJeu(); 
    });
   }
}

function lancerLeJeu() {
    console.log("Le jeu doit se lancer ici !");
}