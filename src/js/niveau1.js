import * as fct from "/src/js/fonctions.js";

export default class niveau1 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau1" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
}

var player;
var clavier;
var gameOver = false;

function preload() {
  this.load.spritesheet("img_perso", "src/assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });

  this.load.image("img_glace", "src/assets/glace.png");

  this.load.image("Phaser_tuile_plage", "src/assets/tuile_plage.png");
  this.load.image("Phaser_tuile_sable", "src/assets/tuile sable.png");
  this.load.image("Phaser_tuile_ancien", "src/assets/tuile_ancien.png");

  this.load.tilemapTiledJSON("map_jeu_glace", "src/assets/map_jeu_glace.tmj");
}

function create() {
  const carteDuNiveau = this.add.tilemap("map_jeu_glace");

  const tilesetAncien = carteDuNiveau.addTilesetImage("tuile_ancien", "Phaser_tuile_ancien");
  const tilesetSable = carteDuNiveau.addTilesetImage("tuile sable", "Phaser_tuile_sable");
  const tilesetPlage = carteDuNiveau.addTilesetImage("tuile_plage", "Phaser_tuile_plage");

  const calque_jeu = carteDuNiveau.createLayer(
    "Calque de Tuiles 1",
    [tilesetAncien, tilesetSable, tilesetPlage],
    0,
    0
  );

  const calque_plateformes = carteDuNiveau.createLayer(
    "calque_plateforme",
    [tilesetAncien, tilesetSable, tilesetPlage],
    0,
    0
  );
  console.log(calque_plateformes);

  calque_plateformes.setCollisionByProperty({ estSolide: true });

  player = this.physics.add.sprite(100, 100, "img_perso");
  player.setCollideWorldBounds(true);
  player.setBounce(0.2);

  this.physics.add.collider(player, calque_plateformes);
  this.physics.add.collider(player, calque_jeu);


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

function update() {
  if (!clavier || !player) {
    return;
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

  if (clavier.up.isDown && player.body.blocked.down) {
    player.setVelocityY(-250);
  }
}
