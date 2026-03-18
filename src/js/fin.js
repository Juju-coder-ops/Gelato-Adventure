export default class fin extends Phaser.Scene {

    constructor() {
        super({
            key: "fin"
        });
    }

    preload() {
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // fond
        this.add.rectangle(centerX, centerY, 800, 600, 0x87ceeb);

        // titre
        this.add.text(centerX, centerY - 80, "BRAVO !", {
            fontSize: "54px",
            color: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);

        // message
        this.add.text(centerX, centerY + 10,
            "Tu as gagné !\nTu as terminé tous les niveaux !",
            {
                fontSize: "28px",
                color: "#ffffff",
                align: "center"
            }
        ).setOrigin(0.5);

        // bouton retour accueil
        var boutonFond = this.add.rectangle(centerX, centerY + 140, 220, 60, 0xff69b4)
            .setOrigin(0.5)
            .setStrokeStyle(3, 0xffffff);

        var boutonTexte = this.add.text(centerX, centerY + 140, "ACCUEIL", {
            fontSize: "28px",
            color: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);

        boutonFond.setInteractive({ useHandCursor: true });

        boutonFond.on("pointerover", () => {
            boutonFond.setFillStyle(0xff85c1);
            boutonFond.setScale(1.05);
            boutonTexte.setScale(1.05);
        });

        boutonFond.on("pointerout", () => {
            boutonFond.setFillStyle(0xff69b4);
            boutonFond.setScale(1);
            boutonTexte.setScale(1);
        });

        boutonFond.on("pointerdown", () => {
            this.scene.start("accueil");
        });
    }
}