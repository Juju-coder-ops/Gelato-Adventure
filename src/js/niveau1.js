import * as fct from "/src/js/fonctions.js";
var player;
var clavier;
var gameOver = false;


export default class niveau1 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau1" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }



  preload() {
    this.load.spritesheet("img_perso", "src/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });

    this.load.image("img_glace", "src/assets/glace.png");

    this.load.image("Phaser_tuile_plage", "src/assets/tuile plage.png");
    this.load.image("Phaser_tuile_ancien", "src/assets/tuile_ancien.png");

    this.load.tilemapTiledJSON("map_jeu_glace", "src/assets/map_jeu_glace.tmj");
  }

  create() {
    const carteDuNiveau = this.add.tilemap("map_jeu_glace");

    const tilesetAncien = carteDuNiveau.addTilesetImage("tuile_ancien", "Phaser_tuile_ancien");
    const tilesetPlage = carteDuNiveau.addTilesetImage("Tuile plage", "Phaser_tuile_plage");

    const calque_jeu = carteDuNiveau.createLayer(
      "fond",
      [tilesetAncien, tilesetPlage],
      0,
      0
    );

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

    player = this.physics.add.sprite(100, 100, "img_perso");
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    this.physics.add.collider(player, calque_plateformes);
    this.physics.add.collider(player, calque_sol);


    clavier = this.input.keyboard.createCursorKeys();

    // animations
    this.anims.create({
      key: "anim_tourne_gauche",
      frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 4 }],
      frameRate: 20
    });

    this.physics.world.setBounds(0, 0, 3000, 960);
    this.cameras.main.setBounds(0, 0, 3000, 960);
    this.cameras.main.startFollow(player);

    // groupe de glaces
    this.glaces = this.physics.add.group();

    this.physics.add.collider(this.glaces, calque_plateformes);
    this.physics.add.overlap(player, this.glaces, toucheGlace, null, this);



    // timer de spawn
    this.timerGlace = this.time.addEvent({
      delay: 1000,
      callback: spawnGlace,
      callbackScope: this,
      loop: true
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

    if (clavier.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-250);
    }
  }


}



function spawnGlace() {
  if (gameOver) return;

  var x = Phaser.Math.Between(0, 800);
  var glace = this.glaces.create(x, 0, "img_glace");

  glace.setBounce(0.3);
  glace.setVelocity(Phaser.Math.Between(-50, 50), 200);
}

function toucheGlace(player, glace) {
  if (gameOver) return;

  gameOver = true;

  this.physics.pause();
  this.timerGlace.remove();

  player.setTint(0xff0000);

  this.tweens.add({
    targets: player,
    alpha: 0,
    duration: 500
  });

  this.add.text(player.x - 100, player.y - 50, "GAME OVER", {
    fontSize: "48px",
    fill: "#ff0000"
  }).setDepth(100);
}