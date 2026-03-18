
var player;
var clavier;
var surVerglas = false;
var calqueVerglas1;
var calqueVerglas2;

export default class niveau3 extends Phaser.Scene {
  constructor() {
    super({
      key: "niveau3"
    });
  }

  preload() {
  console.log("preload lancé");

  this.load.spritesheet("img_perso", "src/assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });

  // TES TILESETS
  this.load.image("fondneige", "src/assets/fondneige.png");
  this.load.image("blocneige", "src/assets/blocneige.png");
  this.load.image("objetneige", "src/assets/objetneige.png");

  // TA MAP
  this.load.tilemapTiledJSON("map_montagne", "src/assets/montagne.tiled-project.tmj");
}
create() {
  console.log("create lancé");

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

  console.log("Tilesets :", tilesetFond, tilesetBloc, tilesetObjet);

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

  console.log("Calques :", calqueVerglas1, calqueVerglas2);

  calqueVerglas1.setCollisionByProperty({ estSolide: true });
  calqueVerglas2.setCollisionByProperty({ estSolide: true });

  player = this.physics.add.sprite(100, 100, "img_perso");
  player.setCollideWorldBounds(true);
  player.setBounce(0.2);
  player.setDragX(1200);
  player.setMaxVelocity(200, 500);

  this.physics.add.collider(player, calqueVerglas1);
  this.physics.add.collider(player, calqueVerglas2);

  clavier = this.input.keyboard.createCursorKeys();

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

  this.physics.world.setBounds(0, 0, 3200, 960);
  this.cameras.main.setBounds(0, 0, 3200, 960);
  this.cameras.main.startFollow(player);
}
update() {
  if (!clavier || !player) {
    return;
  }

  const xPieds = player.x;
  const yPieds = player.body.bottom + 2;

  const tuile1 = calqueVerglas1.getTileAtWorldXY(xPieds, yPieds, true);
  const tuile2 = calqueVerglas2.getTileAtWorldXY(xPieds, yPieds, true);

  surVerglas = false;

  if (tuile1 && tuile1.properties && tuile1.properties.estVerglas) {
    surVerglas = true;
  }

  if (tuile2 && tuile2.properties && tuile2.properties.estVerglas) {
    surVerglas = true;
  }

  if (surVerglas) {
    player.setDragX(120);
  } else {
    player.setDragX(1200);
  }

  if (clavier.right.isDown) {
    player.setAccelerationX(600);
    player.anims.play("anim_tourne_droite", true);
  } else if (clavier.left.isDown) {
    player.setAccelerationX(-600);
    player.anims.play("anim_tourne_gauche", true);
  } else {
    player.setAccelerationX(0);

    if (Math.abs(player.body.velocity.x) < 5) {
      player.setVelocityX(0);
      player.anims.play("anim_face", true);
    }
  }

  if (clavier.up.isDown && player.body.blocked.down) {
    player.setVelocityY(-250);
  }
}
}


