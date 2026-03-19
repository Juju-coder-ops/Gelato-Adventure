var player;
var clavier;
var gameOver = false;
var sautCount = 0;
var texteVies;
var invulnerable = false;

export default class niveau1 extends Phaser.Scene {
  constructor() {
    super({
      key: "niveau1"
    });
  }

  preload() {
    this.load.spritesheet("img_perso", "src/assets/dude.png", {
      frameWidth: 166,
      frameHeight: 205
    });

    this.load.image("img_glace", "src/assets/glace.png");
    this.load.image("Phaser_tuile_plage", "src/assets/tuile plage.png");
    this.load.image("Phaser_tuile_ancien", "src/assets/tuile_ancien.png");
    this.load.image("img_porte_sortie", "src/assets/door_exit.png");
    

    this.load.tilemapTiledJSON("map_jeu_glace", "src/assets/map_jeu_glace.tmj");
  }

  create() {
    gameOver = false;
    sautCount = 0;
    invulnerable = false;

    // Initialisation des vies seulement au début du jeu
    if (this.registry.get("vies") === undefined) {
      this.registry.set("vies", 3);
    }

    const carteDuNiveau = this.add.tilemap("map_jeu_glace");

    const tilesetAncien = carteDuNiveau.addTilesetImage("tuile_ancien", "Phaser_tuile_ancien");
    const tilesetPlage = carteDuNiveau.addTilesetImage("Tuile plage", "Phaser_tuile_plage");

    carteDuNiveau.createLayer("fond", [tilesetAncien, tilesetPlage], 0, 0);

    const calque_plateformes = carteDuNiveau.createLayer(
      "Plateforme",
      [tilesetAncien, tilesetPlage],
      0,
      0
    );

    const calque_sol = carteDuNiveau.createLayer(
      "sol",
      [tilesetAncien, tilesetPlage],
      0,
      0
    );

    calque_plateformes.setCollisionByProperty({ estSolide: true });
    calque_sol.setCollisionByProperty({ estSolide: true });

    player = this.physics.add.sprite(100, 600, "img_perso");
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);
    player.setScale(0.2);

    this.physics.add.collider(player, calque_plateformes);
    this.physics.add.collider(player, calque_sol);

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

    this.physics.world.setBounds(0, 0, 3000, 960);
    this.cameras.main.setBounds(0, 0, 3000, 960);
    this.cameras.main.startFollow(player);

    // Affichage des coeurs
    texteVies = this.add.text(16, 16, "❤️".repeat(this.registry.get("vies")), {
      fontSize: "28px"
    });
    texteVies.setScrollFactor(0);
    texteVies.setDepth(100);

    this.glaces = this.physics.add.group();
    this.maxGlacesEcran = 4;

    this.physics.add.collider(this.glaces, calque_plateformes);
    this.physics.add.collider(this.glaces, calque_sol);
    this.physics.add.overlap(player, this.glaces, toucheGlace, null, this);

    this.timerGlace = this.time.addEvent({
      delay: 2000,
      callback: spawnGlace,
      callbackScope: this,
      loop: true
    });

    this.porte_sortie = this.physics.add.staticSprite(2850, 700, "img_porte_sortie");

    this.add.text(2700, 620, "Appuie sur ESPACE", {
      fontSize: "18px",
      fill: "#ffffff",
      backgroundColor: "#000000"
    });
  }

  update() {
    if (gameOver) return;
    if (!clavier || !player) return;

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

    if (player.body.blocked.down) {
      sautCount = 0;
    }

    if (Phaser.Input.Keyboard.JustDown(clavier.up) && sautCount < 2) {
      player.setVelocityY(-320);
      sautCount++;
    }

    if (Phaser.Input.Keyboard.JustDown(clavier.space)) {
      if (this.physics.overlap(player, this.porte_sortie)) {
        this.scene.start("niveau2");
      }
    }

    this.glaces.children.each(function (glace) {
      if (glace.y > 1200) {
        glace.destroy();
      }
    });
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
  glace.setBounce(0.5, 0.5);
  glace.setVelocity(
  Phaser.Math.Between(-50, 50),
  Phaser.Math.Between(120, 180)
  );
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
      this.registry.set("vies", 5);
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