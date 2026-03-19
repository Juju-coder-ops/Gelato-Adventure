
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

        // fond dégradé simple avec des rectangles
        this.add.rectangle(centerX, centerY, 800, 600, 0x87ceeb);
        this.add.rectangle(centerX, 120, 800, 240, 0xffd6e7).setAlpha(0.35);
        this.add.rectangle(centerX, 500, 800, 200, 0xf7c97f).setAlpha(0.45);

        // petits ronds déco
        this.add.circle(90, 90, 45, 0xffffff, 0.35);
        this.add.circle(700, 120, 30, 0xffffff, 0.25);
        this.add.circle(650, 70, 18, 0xffffff, 0.25);
        this.add.circle(740, 80, 22, 0xffffff, 0.25);

        // titre
        this.add.text(centerX, centerY - 210, "Gelato Adventure", {
            fontSize: "52px",
            color: "#5a2d82",
            fontStyle: "bold"
        }).setOrigin(0.5);

        // sous-titre
        this.add.text(centerX, centerY - 155, "Une aventure gourmande et glacée", {
            fontSize: "24px",
            color: "#ffffff",
            fontStyle: "italic"
        }).setOrigin(0.5);

        // cadre central
        this.add.rectangle(centerX, centerY + 10, 750, 300, 0xffffff, 0.22)
            .setStrokeStyle(3, 0xffffff, 0.7);

        // texte de présentation
        this.add.text(centerX, centerY - 10,
            "Traverse plusieurs mondes remplis de pièges.\n" +
            "Évite les glaces qui tombent du ciel,\n" +
            "récupère des gourmandises et atteins les portes\n" +
            "pour avancer jusqu'au dernier niveau.",
            {
                fontSize: "24px",
                color: "#ffffff",
                align: "center",
                lineSpacing: 8
            }
        ).setOrigin(0.5);

        // commandes
        this.add.text(centerX, centerY + 110,
            "Commandes : flèches pour bouger • ESPACE pour entrer dans une porte \n • F pour tirer",
            {
                fontSize: "18px",
                color: "#fff7e6",
                align: "center"
            }
        ).setOrigin(0.5);

        // ombre du bouton
        this.add.rectangle(centerX + 4, centerY + 205, 190, 60, 0x000000, 0.25).setOrigin(0.5);

        // bouton
        var boutonFond = this.add.rectangle(centerX, centerY + 200, 190, 60, 0xff69b4)
            .setOrigin(0.5)
            .setStrokeStyle(3, 0xffffff);

        var boutonJouer = this.add.text(centerX, centerY + 200, "JOUER", {
            fontSize: "30px",
            color: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);

        boutonFond.setInteractive({ useHandCursor: true });

        boutonFond.on("pointerover", () => {
            boutonFond.setFillStyle(0xff85c1);
            boutonFond.setScale(1.05);
            boutonJouer.setScale(1.05);
        });

        boutonFond.on("pointerout", () => {
            boutonFond.setFillStyle(0xff69b4);
            boutonFond.setScale(1);
            boutonJouer.setScale(1);
        });

        boutonFond.on("pointerdown", () => {
            this.scene.start("niveau1");
        });
    }
}