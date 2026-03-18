
export default class accueil extends Phaser.Scene {

    constructor() {
        super({
            key: "accueil" //  ici on précise le nom de la classe en tant qu'identifiant
        });
    }

    preload() {
    }

create() {
  const centerX = this.scale.width / 2;
  const centerY = this.scale.height / 2;

  this.add.text(centerX, centerY - 200, "Bienvenue sur Gelato Adventure", {
    fontSize: "40px",
    fill: "#000"
  }).setOrigin(0.5);

  this.add.text(centerX, centerY - 120,
    "Plonge dans une aventure gourmande où chaque monde cache\n" +
    "de nouveaux dangers.",
    {
      fontSize: "24px",
      fill: "#ffffff",
      align: "center"
    }
  ).setOrigin(0.5);

  this.add.text(centerX, centerY,
    "Traverse une plage brûlante sous une pluie de glaces,\n" +
    "explore une forêt pleine de chocolats, puis affronte la montagne\n" +
    "et son sol glissant. Évite les dangers, récupère des gourmandises\n" +
    "et atteins les portes pour avancer jusqu'au dernier niveau.",
    {
      fontSize: "20px",
      fill: "#ffffff",
      align: "center"
    }
  ).setOrigin(0.5);

  this.add.text(centerX, centerY + 120,
    "Commandes : flèches pour te déplacer, ESPACE pour entrer dans les portes.",
    {
      fontSize: "18px",
      fill: "#ffffff"
    }
  ).setOrigin(0.5);

  var boutonJouer = this.add.text(centerX, centerY + 200, "Jouer", {
    fontSize: "32px",
    fill: "#fff",
    backgroundColor: "#000",
    padding: { x: 20, y: 10 }
  }).setOrigin(0.5).setInteractive();

  boutonJouer.on("pointerdown", () => {
    this.scene.start("niveau1");
  });
}
}
