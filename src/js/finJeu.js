export default class finJeu extends Phaser.Scene {

    constructor() {
        super({
            key: "finJeu"
        });
    }

    preload() {
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // fond
        this.add.rectangle(centerX, centerY, 800, 600, 0x87ceeb);
        this.add.rectangle(centerX, 120, 800, 240, 0xffd6e7).setAlpha(0.35);
        this.add.rectangle(centerX, 500, 800, 200, 0xf7c97f).setAlpha(0.45);

        // déco
        this.add.circle(90, 90, 45, 0xffffff, 0.35);
        this.add.circle(700, 120, 30, 0xffffff, 0.25);
        this.add.circle(650, 70, 18, 0xffffff, 0.25);
        this.add.circle(740, 80, 22, 0xffffff, 0.25);

        this.add.circle(120, 500, 35, 0xffffff, 0.18);
        this.add.circle(680, 470, 40, 0xffffff, 0.18);

        // titre
        this.add.text(centerX, centerY - 210, "🎉 BRAVO ! 🎉", {
            fontSize: "52px",
            color: "#5a2d82",
            fontStyle: "bold"
        }).setOrigin(0.5);

        // sous-titre
        this.add.text(centerX, centerY - 155, "Tu as terminé toute l'aventure glacée", {
            fontSize: "24px",
            color: "#ffffff",
            fontStyle: "italic"
        }).setOrigin(0.5);

        // cadre central
        this.add.rectangle(centerX, centerY + 5, 750, 280, 0xffffff, 0.22)
            .setStrokeStyle(3, 0xffffff, 0.7);

        // texte principal
        this.add.text(centerX, centerY - 10,
            "Bravo, tu as gagné !\n" +
            "Tu es officiellement devenue\n" +
            "la reine de Gelato Adventure.\n" +
            "Aucun piège n'a pu te stopper !",
            {
                fontSize: "26px",
                color: "#ffffff",
                align: "center",
                lineSpacing: 10
            }
        ).setOrigin(0.5);

        // petit texte fun
        this.add.text(centerX, centerY + 105,
            "Tu peux être fière de toi, championne de la glace ❄️",
            {
                fontSize: "20px",
                color: "#fff7e6",
                align: "center"
            }
        ).setOrigin(0.5);

        // ombre bouton rejouer
        this.add.rectangle(centerX - 108, centerY + 210, 190, 60, 0x000000, 0.25).setOrigin(0.5);

        // bouton rejouer
        var boutonRejouerFond = this.add.rectangle(centerX - 112, centerY + 205, 190, 60, 0xff69b4)
            .setOrigin(0.5)
            .setStrokeStyle(3, 0xffffff);

        var boutonRejouerTexte = this.add.text(centerX - 112, centerY + 205, "REJOUER", {
            fontSize: "26px",
            color: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);

        // ombre bouton accueil
        this.add.rectangle(centerX + 116, centerY + 210, 190, 60, 0x000000, 0.25).setOrigin(0.5);

        // bouton accueil
        var boutonAccueilFond = this.add.rectangle(centerX + 112, centerY + 205, 190, 60, 0x6a5acd)
            .setOrigin(0.5)
            .setStrokeStyle(3, 0xffffff);

        var boutonAccueilTexte = this.add.text(centerX + 112, centerY + 205, "ACCUEIL", {
            fontSize: "26px",
            color: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);

        // interactions bouton rejouer
        boutonRejouerFond.setInteractive({ useHandCursor: true });

        boutonRejouerFond.on("pointerover", () => {
            boutonRejouerFond.setFillStyle(0xff85c1);
            boutonRejouerFond.setScale(1.05);
            boutonRejouerTexte.setScale(1.05);
        });

        boutonRejouerFond.on("pointerout", () => {
            boutonRejouerFond.setFillStyle(0xff69b4);
            boutonRejouerFond.setScale(1);
            boutonRejouerTexte.setScale(1);
        });

        boutonRejouerFond.on("pointerdown", () => {
            this.scene.start("niveau1");
        });

        // interactions bouton accueil
        boutonAccueilFond.setInteractive({ useHandCursor: true });

        boutonAccueilFond.on("pointerover", () => {
            boutonAccueilFond.setFillStyle(0x8470ff);
            boutonAccueilFond.setScale(1.05);
            boutonAccueilTexte.setScale(1.05);
        });

        boutonAccueilFond.on("pointerout", () => {
            boutonAccueilFond.setFillStyle(0x6a5acd);
            boutonAccueilFond.setScale(1);
            boutonAccueilTexte.setScale(1);
        });

        boutonAccueilFond.on("pointerdown", () => {
            this.scene.start("accueil");
        });
    }
}