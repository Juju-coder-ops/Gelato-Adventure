var player;
var clavier;
var gameOver = false;
var score = 0;
var texteScore;
var sautCount = 0;

export default class niveau2 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau2" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }

  preload() {
  this.load.spritesheet("img_perso", "src/assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });

  this.load.image("img_glace", "src/assets/glace.png");
  this.load.image("img_choco", "src/assets/collect_choco.png");

  this.load.image("tileset_foret", "src/assets/foret.jpg");
  this.load.tilemapTiledJSON("map_foret", "src/assets/forest.tmj");
}

create() {
  const carteDuNiveau = this.add.tilemap("map_foret");
  const tilesetForet = carteDuNiveau.addTilesetImage("foret", "tileset_foret");

  const calque_foret = carteDuNiveau.createLayer(
    "Calque de Tuiles 1",
    [tilesetForet],
    0,
    0
  );

  calque_foret.setCollisionByProperty({ estSolide: true });

  player = this.physics.add.sprite(100, 100, "img_perso");
  player.setCollideWorldBounds(true);
  player.setBounce(0.2);

  this.physics.add.collider(player, calque_foret);

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

  this.physics.world.setBounds(0, 0, carteDuNiveau.widthInPixels, carteDuNiveau.heightInPixels);
  this.cameras.main.setBounds(0, 0, carteDuNiveau.widthInPixels, carteDuNiveau.heightInPixels);
  this.cameras.main.startFollow(player);

  texteScore = this.add.text(16, 16, "Score : 0", {
    fontSize: "24px",
    fill: "#ffffff",
    backgroundColor: "#000000"
  });
  texteScore.setScrollFactor(0);
  texteScore.setDepth(100);

  this.glaces = this.physics.add.group();
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
}

}


function spawnGlace() {
  if (gameOver) return;

  var x = Phaser.Math.Between(0, 800);
  var glace = this.glaces.create(x, 0, "img_glace");

  glace.setScale(0.7);
  glace.refreshBody();

  glace.setBounce(0.2);
  glace.setVelocity(Phaser.Math.Between(-30, 30), 150);
}

function ramasserChocolat(player, chocolat) {
  chocolat.destroy();
  score += 10;
  texteScore.setText("Score : " + score);
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