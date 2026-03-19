var player;
var clavier;
var gameOver = false;
var score = 0;
var texteScore;
var texteVies;
var sautCount = 0;
var invulnerable = false;

var calqueVerglas1;
var calqueVerglas2;
var surVerglas = false;

export default class niveau3 extends Phaser.Scene {
  constructor() {
    super({
      key: "niveau3"
    });
  }

  preload() {
    this.load.spritesheet("img_perso", "src/assets/dude.png", {
      frameWidth: 166,
      frameHeight: 205
    });

    this.load.image("img_glace", "src/assets/glace.png");
    this.load.image("img_choco", "src/assets/collect_choco.png");
    this.load.image("img_porte_sortie", "src/assets/door_exit.png");
    this.load.image("img_balle", "src/assets/balle.png");

    // Mets ici les bons chemins de ton niveau 3
    this.load.image("fondneige", "src/assets/fondneige.png");
    this.load.image("blocneige", "src/assets/blocneige.png");
    this.load.image("objetneige", "src/assets/objetneige.png");
    this.load.tilemapTiledJSON("map_montagne", "src/assets/map_montagne.tmj");
    this.load.audio("musique_fond", "src/assets/musique.mp3"); // Ajoutez cette ligne pour charger l'audio
  }

  create() {
    gameOver = false;
    sautCount = 0;
    score = 0;
    invulnerable = false;
    surVerglas = false;

    if (this.registry.get("vies") === undefined) {
      this.registry.set("vies", 3);
    }

    const carteDuNiveau = this.add.tilemap("map_montagne");

    const tilesetFond = carteDuNiveau.addTilesetImage(
      "ChatGPT Image 17 mars 2026, 11_15_41",
      "fondneige"
    );

    const tilesetBloc = carteDuNiveau.addTilesetImage(
      "ChatGPT Image 17 mars 2026, 11_47_33",
      "blocneige"
    );

    const tilesetObjet = carteDuNiveau.addTilesetImage(
      "ChatGPT Image 17 mars 2026 à 12_01_52",
      "objetneige"
    );

    calqueVerglas1 = carteDuNiveau.createLayer(
      "Calque de Tuiles 1",
      [tilesetFond, tilesetBloc, tilesetObjet],
      0,
      0
    );

    calqueVerglas2 = carteDuNiveau.createLayer(
      "Calque de Tuiles 2",
      [tilesetFond, tilesetBloc, tilesetObjet],
      0,
      0
    );

    calqueVerglas1.setCollisionByProperty({ estSolide: true });
    calqueVerglas2.setCollisionByProperty({ estSolide: true });

    player = this.physics.add.sprite(100, 100, "img_perso");
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);
    player.setScale(0.2);

    player.setMaxVelocity(200, 500);
    player.setDragX(1200);

    this.physics.add.collider(player, calqueVerglas1);
    this.physics.add.collider(player, calqueVerglas2);

    clavier = this.input.keyboard.createCursorKeys();

    if (!this.anims.exists("anim_tourne_gauche")) {
      this.anims.create({
        key: "anim_tourne_gauche",
        frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
    }

    if (!this.anims.exists("anim_tourne_droite")) {
      this.anims.create({
        key: "anim_tourne_droite",
        frames: this.anims.generateFrameNumbers("img_perso", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });
    }

    if (!this.anims.exists("anim_face")) {
      this.anims.create({
        key: "anim_face",
        frames: [{ key: "img_perso", frame: 4 }],
        frameRate: 20
      });
    }

    this.physics.world.setBounds(
      0,
      0,
      carteDuNiveau.widthInPixels,
      carteDuNiveau.heightInPixels
    );
    this.cameras.main.setBounds(
      0,
      0,
      carteDuNiveau.widthInPixels,
      carteDuNiveau.heightInPixels
    );
    this.cameras.main.startFollow(player);

    texteScore = this.add.text(16, 16, "Score : 0/10", {
      fontSize: "18px",
      fill: "#ffffff",
      fontFamily: "Arial"
    });
    texteScore.setScrollFactor(0);
    texteScore.setDepth(100);

    texteVies = this.add.text(16, 50, "❤️".repeat(this.registry.get("vies")), {
      fontSize: "20px",
      fontFamily: "Arial"
    });
    texteVies.setScrollFactor(0);
    texteVies.setDepth(100);

    this.add.text(16, 80, "récupère tous les chocolats en évitant le sol glissant", {
      fontSize: "12px",
      fill: "#ffffff",
      fontFamily: "Arial"
    }).setScrollFactor(0).setDepth(100);

    this.glaces = this.physics.add.group();
    this.maxGlacesEcran = 4;

    this.physics.add.collider(this.glaces, calqueVerglas1);
    this.physics.add.collider(this.glaces, calqueVerglas2);
    this.physics.add.overlap(player, this.glaces, toucheGlace, null, this);

    this.balles = this.physics.add.group();

this.physics.add.overlap(this.balles, this.glaces, detruireGlace, null, this);

this.toucheTir = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
this.directionJoueur = "droite";
this.lastShot = 0;

    this.timerGlace = this.time.addEvent({
      delay: 2000,
      callback: spawnGlace,
      callbackScope: this,
      loop: true
    });

    this.chocolats = this.physics.add.group();

    var positionsChoco = [
      { x: 200, y: 0 },
      { x: 350, y: 0 },
      { x: 500, y: 0 },
      { x: 650, y: 0 },
      { x: 850, y: 0 },
      { x: 1000, y: 0 },
      { x: 1200, y: 0 },
      { x: 1400, y: 0 },
      { x: 1600, y: 0 },
      { x: 1800, y: 0 }
    ];

    this.totalChocolats = positionsChoco.length; // Store total chocolates

    positionsChoco.forEach(function (pos) {
      var choco = this.chocolats.create(pos.x, pos.y, "img_choco");
      choco.setBounce(0.1);
      choco.setCollideWorldBounds(true);
    }, this);

    this.physics.add.collider(this.chocolats, calqueVerglas1);
    this.physics.add.collider(this.chocolats, calqueVerglas2);
    this.physics.add.overlap(player, this.chocolats, ramasserChocolat, null, this);

    this.porte_sortie = this.physics.add.staticSprite(3000, 700, "img_porte_sortie");

    this.add.text(2850, 620, "Appuie sur ESPACE", {
      fontSize: "18px",
      fill: "#ffffff"
    });

    this.textePorte = this.add.text(2600, 580, "", {
      fontSize: "18px",
      fill: "#ff0000"
    });

    //this.musique = this.sound.add("musique_fond", { loop: true, volume: 0.5 }); // Créez l'objet audio
    //this.musique.play(); // Jouez la musique
  }

  update() {
    if (gameOver) return;
    if (!clavier || !player) return;

    const xPieds = player.x;
    const yPieds = player.body.bottom + 2;

    const tuile1 = calqueVerglas1.getTileAtWorldXY(xPieds, yPieds, true);
    const tuile2 = calqueVerglas2.getTileAtWorldXY(xPieds, yPieds, true);

    surVerglas = false;

    if (tuile1 && tuile1.collides) {
      surVerglas = true;
    }

    if (tuile2 && tuile2.collides) {
      surVerglas = true;
    }

    if (surVerglas) {
      player.setDragX(10);
    } else {
      player.setDragX(1200);
    }

   if (clavier.right.isDown) {
  player.setVelocityX(160);
  player.anims.play("anim_tourne_droite", true);
  this.directionJoueur = "droite";
} else if (clavier.left.isDown) {
  player.setVelocityX(-160);
  player.anims.play("anim_tourne_gauche", true);
  this.directionJoueur = "gauche";
} else {
  player.setVelocityX(0);
  player.anims.play("anim_face");
}

    if (player.body.blocked.down) {
      sautCount = 0;
    }

    if (Phaser.Input.Keyboard.JustDown(clavier.up) && sautCount < 2) {
      player.setVelocityY(-320);
      sautCount++;
    }

    if (this.physics.overlap(player, this.porte_sortie)) {
      if (this.chocolats.countActive(true) === 0) {
        this.textePorte.setText("Appuie sur ESPACE pour finir");
      } else {
        this.textePorte.setText("Ramasse tous les chocolats");
      }
    } else {
      this.textePorte.setText("");
    }

    if (Phaser.Input.Keyboard.JustDown(clavier.space)) {
      if (this.physics.overlap(player, this.porte_sortie)) {
        if (this.chocolats.countActive(true) === 0) {
          this.scene.start("fin");
        }
      }
    }

    this.glaces.children.each(function (glace) {
      if (glace.y > 1200) {
        glace.destroy();
      }
    });

    if (Phaser.Input.Keyboard.JustDown(this.toucheTir)) {
  if (this.time.now > this.lastShot + 300) {
    tirerBalle.call(this);
    this.lastShot = this.time.now;
  }
}
  }

}

function spawnGlace() {
  if (gameOver) return;

  var cameraX = this.cameras.main.scrollX;
  var cameraY = this.cameras.main.scrollY;
  var largeurCamera = this.cameras.main.width;
  var hauteurCamera = this.cameras.main.height;

  var nbGlacesVisibles = 0;

  this.glaces.children.each(function (glace) {
    if (
      glace.active &&
      glace.x >= cameraX &&
      glace.x <= cameraX + largeurCamera &&
      glace.y >= cameraY - 100 &&
      glace.y <= cameraY + hauteurCamera + 100
    ) {
      nbGlacesVisibles++;
    }
  });

  if (nbGlacesVisibles >= this.maxGlacesEcran) {
    return;
  }

  var x = Phaser.Math.Between(cameraX, cameraX + largeurCamera);
  var y = cameraY - 50;

  var glace = this.glaces.create(x, y, "img_glace");

glace.setScale(0.7);
glace.setCollideWorldBounds(true);
glace.setBounce(0.75, 0.75);
glace.setVelocity(
  Phaser.Math.Between(-50, 50),
  Phaser.Math.Between(120, 180)
);
}

function ramasserChocolat(player, chocolat) {
  chocolat.destroy();
  score += 1; // Increment score by 1
  texteScore.setText(`Score : ${score}/${this.totalChocolats}`); // Update score format
}

function toucheGlace(player, glace) {
  if (gameOver || invulnerable) return;

  invulnerable = true;
  glace.destroy();

  let vies = this.registry.get("vies");
  vies -= 1;
  this.registry.set("vies", vies);

  texteVies.setText("❤️".repeat(vies));
  player.setTint(0xff0000);

  if (vies <= 0) {
    gameOver = true;
    this.physics.pause();
    this.timerGlace.remove();

    this.add.text(player.x - 100, player.y - 80, "GAME OVER", {
      fontSize: "48px",
      fill: "#ff0000"
    }).setDepth(100);

    this.time.delayedCall(1500, () => {
      this.registry.set("vies", 3);
      score = 0;
      this.scene.start("niveau1");
    });

    //this.musique.stop(); // Arrêtez la musique au game over

    return;
  }

  this.tweens.add({
    targets: player,
    alpha: 0.3,
    duration: 100,
    yoyo: true,
    repeat: 5,
    onComplete: () => {
      player.setAlpha(1);
      player.clearTint();
      invulnerable = false;
    }
  });
}

function tirerBalle() {
  let xBalle;

  if (this.directionJoueur === "droite") {
    xBalle = player.x + 30;
  } else {
    xBalle = player.x - 30;
  }

  var balle = this.balles.create(xBalle, player.y, "img_balle");

  balle.setScale(0.5);
  balle.setDepth(200);
  balle.setCollideWorldBounds(false);
  balle.body.allowGravity = false;

  if (this.directionJoueur === "droite") {
    balle.setVelocityX(500);
  } else {
    balle.setVelocityX(-500);
  }
}

function detruireGlace(balle, glace) {
  balle.destroy();
  glace.destroy();
}