var configAccueil = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#87ceebff",
    scene: {
        preload: preload,
        create: create
    }
};

var gameAccueil = new Phaser.Game(configAccueil);

function preload() {
}

function create() {
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

function lancerLeJeu() {
    console.log("Le jeu doit se lancer ici !");
}