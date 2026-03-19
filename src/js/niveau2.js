var player;
var clavier;
var gameOver = false;
var score = 0;
var texteScore;
var texteVies;
var sautCount = 0;
var invulnerable = false;

export default class niveau2 extends Phaser.Scene {
  constructor() {
    super({
      key: "niveau2"
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

    this.load.image("tileset_foret", "src/assets/foret.jpg");
    this.load.tilemapTiledJSON("map_foret", "src/assets/forest.tmj");
  }

  create() {
    gameOver = false;
    sautCount = 0;
    invulnerable = false;
    score = 0;

    if (this.registry.get("vies") === undefined) {
      this.registry.set("vies", 3);
    }

    const carteDuNiveau = this.add.tilemap("map_foret");
    const tilesetForet = carteDuNiveau.addTilesetImage("foret", "tileset_foret");

    const calque_foret = carteDuNiveau.createLayer(
      "Calque de Tuiles 1",
      [tilesetForet],
      0,
      0
    );

    calque_foret.setCollisionByProperty({ estSolide: true });

    player = this.physics.add.sprite(120, 620, "img_perso");
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);
    player.setScale(0.2);

    this.physics.add.collider(player, calque_foret);

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

    texteScore = this.add.text(16, 16, "Score : " + score, {
      fontSize: "24px",
      fill: "#ffffff",
      backgroundColor: "#000000"
    });
    texteScore.setScrollFactor(0);
    texteScore.setDepth(100);

    texteVies = this.add.text(16, 50, "❤️".repeat(this.registry.get("vies")), {
      fontSize: "28px"
    });
    texteVies.setScrollFactor(0);
    texteVies.setDepth(100);

    // Add game rule text at the top of the screen
    this.add.text(16, 80, "Récupère tous les chocolats et atteins la porte pour passer au niveau suivant", {
      fontSize: "16px", // Smaller font size
      fill: "#ffffff", // Keep the white color
      fontFamily: "Arial", // Elegant font style
      wordWrap: { width: 800 } // Keep word wrapping
    }).setScrollFactor(0).setDepth(100);

    this.glaces = this.physics.add.group();
    this.maxGlacesEcran = 4;
    this.physics.add.collider(this.glaces, calque_foret);
    this.physics.add.overlap(player, this.glaces, toucheGlace, null, this);

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

    positionsChoco.forEach(function (pos) {
      var choco = this.chocolats.create(pos.x, pos.y, "img_choco");
      choco.setBounce(0.1);
      choco.setCollideWorldBounds(true);
    }, this);

    this.physics.add.collider(this.chocolats, calque_foret);
    this.physics.add.overlap(player, this.chocolats, ramasserChocolat, null, this);

    this.porte_sortie = this.physics.add.staticSprite(2725, 700, "img_porte_sortie");

    this.add.text(2700, 620, "Appuie sur ESPACE", {
      fontSize: "18px",
      fill: "#ffffff",
      backgroundColor: "#000000"
    });

    this.textePorte = this.add.text(2600, 580, "", {
      fontSize: "18px",
      fill: "#ff0000",
      backgroundColor: "#000000"
    });
  }

  update() {
    if (gameOver) return;
    if (!clavier || !player) return;

    if (player.body.blocked.down) {
      sautCount = 0;
    }

    if (clavier.right.isDown) {
      player.setVelocityX(160);
      player.anims.play("anim_tourne_droite", true);
    } else if (clavier.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play("anim_tourne_gauche", true);
    } else {
      player.setVelocityX(0);
      player.anims.play("anim_face");
    }

    if (Phaser.Input.Keyboard.JustDown(clavier.up) && sautCount < 2) {
      player.setVelocityY(-320);
      sautCount++;
    }

    this.glaces.children.each(function (glace) {
      if (glace.y > 1200) {
        glace.destroy();
      }
    });

    if (this.physics.overlap(player, this.porte_sortie)) {
      if (this.chocolats.countActive(true) === 0) {
        this.textePorte.setText("Appuie sur ESPACE pour passer");
      } else {
        this.textePorte.setText("Ramasse tous les chocolats");
      }
    } else {
      this.textePorte.setText("");
    }

    if (Phaser.Input.Keyboard.JustDown(clavier.space)) {
      if (this.physics.overlap(player, this.porte_sortie)) {
        if (this.chocolats.countActive(true) === 0) {
          this.scene.start("niveau3");
        }
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
glace.setBounce(1, 1);
glace.setVelocity(
  Phaser.Math.Between(-50, 50),
  Phaser.Math.Between(120, 180)
);
}

function ramasserChocolat(player, chocolat) {
  chocolat.destroy();
  score += 10;
  texteScore.setText("Score : " + score);
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
      fill: "#ff0000",
      backgroundColor: "#000000"
    }).setDepth(100);

    this.time.delayedCall(1500, () => {
      this.registry.set("vies", 3);
      score = 0;
      this.scene.start("niveau1");
    });

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