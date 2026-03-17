var player;
var clavier;
var groupe_glaces;
var groupe_gateaux;
var gameOver = false;
var niveau = 1;

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
  scene: [Niveau 1, InterNiveau, Niveau 2, FinScene]
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

  const calque_plateformes = carteDuNiveau.createLayer(
    "calque_plateforme",
    [tilesetAncien, tilesetSable, tilesetPlage],
    0,
    0
  );

  calque_plateformes.setCollisionByProperty({ estSolide: true });

  player = this.physics.add.sprite(100, 100, "img_perso");
  player.setCollideWorldBounds(true);
  player.setBounce(0.2);

  this.physics.add.collider(player, calque_plateformes);

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


  this.physics.world.setBounds(0, 0, 2000, 600);
  this.cameras.main.setBounds(0, 0, 2000, 600);
  this.cameras.main.startFollow(player);

  this.glaces = this.physics.add.group();

  this.physics.add.collider(this.glaces, calque_plateformes);
  this.physics.add.overlap(player, this.glaces, toucheGlace, null, this);

  this.timerGlace = this.time.addEvent({
    delay: 1000,
    callback: spawnGlace,
    callbackScope: this,
    loop: true
  });
  this.time.delayedCall(10000, () => {
  if (!gameOver) {
    niveau++;

    if (niveau <= 3) {
      this.scene.restart(); 
    } else {
      this.scene.start("FinScene");
    }
  }
});
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
  var vitesse = 200 + niveau * 50;
  glace.setVelocity(Phaser.Math.Between(-50, 50), vitesse);
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

function MenuScene() {}

MenuScene.prototype = {
  preload: preload,

  create: function () {
    this.add.text(300, 200, "Bonjour", {
      fontSize: "48px",
      fill: "#000"
    });

    var bouton = this.add.text(250, 300, "Démarrer le jeu", {
      fontSize: "32px",
      fill: "#000",
      backgroundColor: "#ffffff"
    }).setInteractive();

    bouton.on("pointerdown", () => {
      niveau = 1;
      this.scene.start("GameScene");
    });
  }
};
function FinScene() {}
function GameScene() {}

GameScene.prototype = {
  preload: preload,
  create: create,
  update: update
};

FinScene.prototype = {
  create: function () {
    this.add.text(200, 250, "BRAVO TU AS GAGNÉ 🎉", {
      fontSize: "40px",
      fill: "#000"
    });
  }
};