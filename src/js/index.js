
var player;
var clavier;
var gameOver = false;

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#87ceeb",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

new Phaser.Game(config);

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


var player;
var clavier;

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#87ceeb",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

new Phaser.Game(config);

function preload() {
  console.log("preload lancé");

  this.load.spritesheet("img_perso", "src/assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });

  // Charge les 3 images de tileset de TA map
  // Remplace les noms de fichiers PNG par les vrais noms de tes images
  this.load.image("fond_neige", "src/assets/fond_neige.png");
  this.load.image("bloc_neige", "src/assets/bloc_neige.png");
  this.load.image("objet_neige", "src/assets/objet_neige.png");

  // Charge TA map
  this.load.tilemapTiledJSON("map_montagne", "src/assets/montagne.tiled-project.tmj");
}

function create() {
  console.log("create lancé");

  const carteDuNiveau = this.add.tilemap("map_montagne");

  // IMPORTANT :
  // Le 1er argument doit être le nom EXACT du tileset dans Tiled
  // Le 2e argument doit être la clé utilisée dans this.load.image(...)

  const tileset1 = carteDuNiveau.addTilesetImage(
    "ChatGPT Image 17 mars 2026, 11_15_41",
    "fond_neige"
  );

  const tileset2 = carteDuNiveau.addTilesetImage(
    "ChatGPT Image 17 mars 2026, 11_47_33",
    "bloc_neige"
  );

  const tileset3 = carteDuNiveau.addTilesetImage(
    "ChatGPT Image 17 mars 2026 à 12_01_52",
    "objet_neige"
  );

  console.log(tileset1, tileset2, tileset3);

  // Tes 2 calques trouvés dans la map
  const calque1 = carteDuNiveau.createLayer(
    "Calque de Tuiles 1",
    [tileset1, tileset2, tileset3],
    0,
    0
  );

  const calque2 = carteDuNiveau.createLayer(
    "Calque de Tuiles 2",
    [tileset1, tileset2, tileset3],
    0,
    0
  );

  console.log(calque1, calque2);

  // Collision si dans Tiled les tuiles solides ont la propriété estSolide = true
  calque1.setCollisionByProperty({ estSolide: true });
  calque2.setCollisionByProperty({ estSolide: true });

  player = this.physics.add.sprite(100, 100, "img_perso");
  player.setCollideWorldBounds(true);
  player.setBounce(0.2);

  this.physics.add.collider(player, calque1);
  this.physics.add.collider(player, calque2);

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

  // Taille réelle de TA map : 100 tuiles x 32 px = 3200 px
  // Hauteur : 30 tuiles x 32 px = 960 px
  this.physics.world.setBounds(0, 0, 3200, 960);
  this.cameras.main.setBounds(0, 0, 3200, 960);
  this.cameras.main.startFollow(player);
}

function update() {
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
